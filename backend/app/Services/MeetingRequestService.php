<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\MeetingRequestStatus;
use App\Enums\MeetingRequestUrgency;
use App\Events\MeetingRequestAccepted;
use App\Events\MeetingRequestCreated;
use App\Events\MeetingRequestReassigned;
use App\Exceptions\MeetingRequestConflictException;
use App\Models\MeetingRequest;
use App\Models\User;
use App\Repositories\MeetingRequestRepository;
use Illuminate\Support\Facades\DB;

/**
 * All meeting-request business rules live here — controllers stay thin and
 * every entry point (API, dashboard, future console/CRM sync) shares the
 * exact same behaviour, transactions and audit trail.
 */
class MeetingRequestService
{
    public function __construct(
        private readonly MeetingRequestRepository $repository,
        private readonly ActivityLogger $activity,
    ) {}

    /** Visitor submits the public form. */
    public function create(array $data, ?string $sourceIp = null): MeetingRequest
    {
        $request = MeetingRequest::create([
            ...$data,
            'urgency' => MeetingRequestUrgency::fromPreferredDate(
                \Illuminate\Support\Carbon::parse($data['preferred_date']),
            )->value,
            'status' => MeetingRequestStatus::Pending->value,
            'source_ip' => $sourceIp,
        ]);

        $this->activity->log('meeting_request.created', $request, actor: null, context: [
            'email' => $request->email,
        ]);

        // Pushes the new card onto every connected dashboard in real time.
        MeetingRequestCreated::dispatch($request);

        return $request;
    }

    /**
     * Race-safe acceptance. Concurrency contract:
     *
     *  1. Everything runs inside one database transaction.
     *  2. The row is re-read with SELECT ... FOR UPDATE (lockForUpdate).
     *     PostgreSQL blocks every other acceptor on that row until this
     *     transaction commits or rolls back.
     *  3. The status check happens ON THE LOCKED ROW — the second employee's
     *     transaction resumes only after the first has committed, re-reads
     *     the now-'accepted' row, fails the check, and gets a 409.
     *
     * Ten simultaneous clicks → one winner, nine clean conflicts.
     * No lost updates, no double assignment, at any isolation level.
     */
    public function accept(MeetingRequest $request, User $employee): MeetingRequest
    {
        $accepted = DB::transaction(function () use ($request, $employee) {
            $locked = $this->repository->lockById($request->id);

            if ($locked === null) {
                throw MeetingRequestConflictException::alreadyAccepted($request);
            }

            if (! $locked->isPending()) {
                $locked->load('assignedEmployee');
                throw MeetingRequestConflictException::alreadyAccepted($locked);
            }

            $locked->forceFill([
                'status' => MeetingRequestStatus::Accepted,
                'assigned_employee_id' => $employee->id,
                'accepted_at' => now(),
            ])->save();

            $this->activity->log('meeting_request.accepted', $locked, $employee, [
                'assigned_employee_id' => $employee->id,
            ]);

            return $locked;
        });

        // Side effects run strictly AFTER commit — a rolled-back acceptance
        // must never broadcast or notify.
        MeetingRequestAccepted::dispatch($accepted, $employee);

        return $accepted->load('assignedEmployee');
    }

    /** Admin hands a request to a different employee. */
    public function reassign(MeetingRequest $request, User $newEmployee, User $admin): MeetingRequest
    {
        $reassigned = DB::transaction(function () use ($request, $newEmployee, $admin) {
            $locked = $this->repository->lockById($request->id);

            if ($locked === null || $locked->status === MeetingRequestStatus::Pending) {
                throw MeetingRequestConflictException::invalidTransition(
                    $locked ?? $request,
                    'reassigned',
                );
            }

            $previousId = $locked->assigned_employee_id;

            $locked->forceFill([
                'assigned_employee_id' => $newEmployee->id,
                // Reassignment is still an accepted request; accepted_at keeps
                // the original acceptance moment for accurate SLA metrics.
            ])->save();

            $this->activity->log('meeting_request.reassigned', $locked, $admin, [
                'from_employee_id' => $previousId,
                'to_employee_id' => $newEmployee->id,
            ]);

            return $locked;
        });

        MeetingRequestReassigned::dispatch($reassigned, $newEmployee);

        return $reassigned->load('assignedEmployee');
    }

    /** Status changes (complete / cancel / reopen) with transition guard. */
    public function changeStatus(MeetingRequest $request, MeetingRequestStatus $to, User $actor): MeetingRequest
    {
        return DB::transaction(function () use ($request, $to, $actor) {
            $locked = $this->repository->lockById($request->id);

            if ($locked === null || ! $locked->status->canTransitionTo($to)) {
                throw MeetingRequestConflictException::invalidTransition(
                    $locked ?? $request,
                    $to->value,
                );
            }

            $from = $locked->status;
            $locked->forceFill(['status' => $to]);

            if ($to === MeetingRequestStatus::Pending) {
                // Reopening releases ownership so any employee can claim it.
                $locked->forceFill(['assigned_employee_id' => null, 'accepted_at' => null]);
            }

            $locked->save();

            $this->activity->log('meeting_request.status_changed', $locked, $actor, [
                'from' => $from->value,
                'to' => $to->value,
            ]);

            return $locked->load('assignedEmployee');
        });
    }

    /** Update scheduling details (zoom link, confirmed time). */
    public function updateDetails(MeetingRequest $request, array $data, User $actor): MeetingRequest
    {
        $request->fill($data)->save();

        $this->activity->log('meeting_request.updated', $request, $actor, [
            'fields' => array_keys($data),
        ]);

        return $request->load('assignedEmployee');
    }

    public function delete(MeetingRequest $request, User $actor): void
    {
        $request->delete();

        $this->activity->log('meeting_request.deleted', $request, $actor);
    }
}
