<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReassignMeetingRequestRequest;
use App\Http\Resources\MeetingRequestResource;
use App\Models\ActivityLog;
use App\Models\MeetingRequest;
use App\Models\User;
use App\Repositories\MeetingRequestRepository;
use App\Services\MeetingRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Administration surface: reassignment, oversight metrics, audit trail,
 * data export. All routes behind the `admin` middleware.
 */
class AdminController extends Controller
{
    public function __construct(
        private readonly MeetingRequestService $service,
        private readonly MeetingRequestRepository $repository,
    ) {}

    /** POST /api/admin/meeting-requests/{meetingRequest}/reassign */
    public function reassign(
        ReassignMeetingRequestRequest $request,
        MeetingRequest $meetingRequest,
    ): MeetingRequestResource {
        $employee = User::query()->findOrFail($request->validated('employee_id'));

        return new MeetingRequestResource(
            $this->service->reassign($meetingRequest, $employee, $request->user()),
        );
    }

    /** GET /api/admin/stats — dashboard KPIs + per-employee performance. */
    public function stats(): JsonResponse
    {
        return response()->json([
            'by_status' => $this->repository->countByStatus(),
            'employee_performance' => $this->repository->employeePerformance(),
        ]);
    }

    /** GET /api/admin/employees — for the reassignment picker. */
    public function employees(): JsonResponse
    {
        return response()->json([
            'data' => User::query()
                ->active()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'role']),
        ]);
    }

    /** GET /api/admin/activity-logs — paginated audit trail. */
    public function activityLogs(Request $request): JsonResponse
    {
        $logs = ActivityLog::query()
            ->with('user:id,name')
            ->when($request->input('action'), fn ($q, $a) => $q->where('action', $a))
            ->when($request->input('user_id'), fn ($q, $id) => $q->where('user_id', $id))
            ->latest('created_at')
            ->paginate(min((int) $request->integer('per_page', 50), 200));

        return response()->json($logs);
    }

    /**
     * GET /api/admin/meeting-requests/export — CSV, streamed so exports of
     * any size run in constant memory.
     */
    public function export(Request $request): StreamedResponse
    {
        $filters = $request->only(['status', 'urgency', 'assigned_employee_id', 'search', 'date_from', 'date_to']);

        return response()->streamDownload(function () use ($filters) {
            $out = fopen('php://output', 'w');
            // UTF-8 BOM so Excel opens accents correctly.
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, [
                'Référence', 'Nom', 'Email', 'Téléphone', 'Société',
                'Date souhaitée', 'Heure', 'Urgence', 'Statut',
                'Assigné à', 'Accepté le', 'Créé le',
            ], ';');

            foreach ($this->repository->cursorFiltered($filters) as $r) {
                fputcsv($out, [
                    $r->reference,
                    $r->full_name,
                    $r->email,
                    $r->phone,
                    $r->company,
                    $r->preferred_date->format('d/m/Y'),
                    $r->preferred_time,
                    $r->urgency->label(),
                    $r->status->label(),
                    $r->assignedEmployee?->name,
                    $r->accepted_at?->format('d/m/Y H:i'),
                    $r->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($out);
        }, 'demandes-reunion-'.now()->format('Y-m-d').'.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
