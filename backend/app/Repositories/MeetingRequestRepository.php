<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Enums\MeetingRequestStatus;
use App\Models\MeetingRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Query layer for meeting requests. Controllers and services never build
 * ad-hoc Eloquent queries — every read path lives here, so indexes and
 * query shapes can be tuned in one place as volume grows.
 */
class MeetingRequestRepository
{
    /**
     * Re-fetch a request by primary key with a pessimistic write lock.
     * MUST be called inside a transaction: SELECT ... FOR UPDATE blocks
     * concurrent acceptors until the surrounding transaction commits.
     */
    public function lockById(int $id): ?MeetingRequest
    {
        return MeetingRequest::query()->lockForUpdate()->find($id);
    }

    /**
     * Dashboard / admin listing with filters, newest first.
     *
     * @param array{
     *   status?: string|null,
     *   urgency?: string|null,
     *   assigned_employee_id?: int|null,
     *   search?: string|null,
     *   date_from?: string|null,
     *   date_to?: string|null,
     * } $filters
     */
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return $this->filtered($filters)
            ->with('assignedEmployee:id,name,email')
            ->latest()
            ->paginate(min($perPage, 100));
    }

    /** Same filters as paginate(), unpaginated — used by CSV export. */
    public function cursorFiltered(array $filters = []): \Illuminate\Support\LazyCollection
    {
        return $this->filtered($filters)
            ->with('assignedEmployee:id,name,email')
            ->latest()
            ->lazy(500);
    }

    private function filtered(array $filters): Builder
    {
        return MeetingRequest::query()
            ->when($filters['status'] ?? null, fn (Builder $q, string $s) => $q->where('status', $s))
            ->when($filters['urgency'] ?? null, fn (Builder $q, string $u) => $q->where('urgency', $u))
            ->when($filters['assigned_employee_id'] ?? null, fn (Builder $q, int|string $id) => $q->where('assigned_employee_id', $id))
            ->when($filters['date_from'] ?? null, fn (Builder $q, string $d) => $q->whereDate('created_at', '>=', $d))
            ->when($filters['date_to'] ?? null, fn (Builder $q, string $d) => $q->whereDate('created_at', '<=', $d))
            ->when($filters['search'] ?? null, function (Builder $q, string $term) {
                $like = '%'.str_replace(['%', '_'], ['\%', '\_'], trim($term)).'%';
                $q->where(fn (Builder $sub) => $sub
                    ->where('full_name', 'ilike', $like)
                    ->orWhere('email', 'ilike', $like)
                    ->orWhere('company', 'ilike', $like)
                    ->orWhere('phone', 'ilike', $like));
            });
    }

    /**
     * Per-employee performance aggregates for the admin panel.
     * Single grouped query — no N+1 as the team grows.
     */
    public function employeePerformance(): Collection
    {
        return DB::table('meeting_requests')
            ->join('users', 'users.id', '=', 'meeting_requests.assigned_employee_id')
            ->whereNull('meeting_requests.deleted_at')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc(DB::raw('count(*)'))
            ->get([
                DB::raw('users.id'),
                DB::raw('users.name'),
                DB::raw('count(*) as total_assigned'),
                DB::raw("count(*) filter (where meeting_requests.status = 'completed') as completed"),
                DB::raw("count(*) filter (where meeting_requests.status = 'accepted') as in_progress"),
                DB::raw('round(avg(extract(epoch from (meeting_requests.accepted_at - meeting_requests.created_at)) / 60)) as avg_minutes_to_accept'),
            ]);
    }

    public function countByStatus(): array
    {
        return MeetingRequest::query()
            ->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->map(fn ($v) => (int) $v)
            ->all() + array_fill_keys(
                array_column(MeetingRequestStatus::cases(), 'value'),
                0,
            );
    }
}
