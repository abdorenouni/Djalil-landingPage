<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\MeetingRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMeetingRequestRequest;
use App\Http\Requests\UpdateMeetingRequestRequest;
use App\Http\Resources\MeetingRequestResource;
use App\Models\MeetingRequest;
use App\Repositories\MeetingRequestRepository;
use App\Services\MeetingRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Thin HTTP layer: validate (FormRequest), authorize (Policy), delegate
 * (Service/Repository), shape output (Resource). No business logic here.
 */
class MeetingRequestController extends Controller
{
    public function __construct(
        private readonly MeetingRequestService $service,
        private readonly MeetingRequestRepository $repository,
    ) {}

    /** POST /api/meeting-requests — public visitor form. 201 Created. */
    public function store(StoreMeetingRequestRequest $request): JsonResponse
    {
        $meetingRequest = $this->service->create(
            $request->validated(),
            $request->ip(),
        );

        return response()->json([
            'message' => 'Votre demande a bien été enregistrée. Notre équipe vous contactera rapidement.',
            'reference' => $meetingRequest->reference,
        ], 201);
    }

    /** GET /api/meeting-requests — authenticated staff listing. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', MeetingRequest::class);

        return MeetingRequestResource::collection(
            $this->repository->paginate(
                filters: $request->only(['status', 'urgency', 'assigned_employee_id', 'search', 'date_from', 'date_to']),
                perPage: (int) $request->integer('per_page', 20),
            ),
        );
    }

    /** GET /api/meeting-requests/{meetingRequest} */
    public function show(MeetingRequest $meetingRequest): MeetingRequestResource
    {
        $this->authorize('view', $meetingRequest);

        return new MeetingRequestResource($meetingRequest->load('assignedEmployee'));
    }

    /**
     * POST /api/meeting-requests/{meetingRequest}/accept
     * 200 on success; 409 (via MeetingRequestConflictException) when another
     * employee won the race.
     */
    public function accept(Request $request, MeetingRequest $meetingRequest): MeetingRequestResource
    {
        $this->authorize('accept', $meetingRequest);

        return new MeetingRequestResource(
            $this->service->accept($meetingRequest, $request->user()),
        );
    }

    /** PATCH /api/meeting-requests/{meetingRequest} */
    public function update(UpdateMeetingRequestRequest $request, MeetingRequest $meetingRequest): MeetingRequestResource
    {
        $this->authorize('update', $meetingRequest);

        $validated = $request->validated();

        if (isset($validated['status'])) {
            $meetingRequest = $this->service->changeStatus(
                $meetingRequest,
                MeetingRequestStatus::from($validated['status']),
                $request->user(),
            );
            unset($validated['status']);
        }

        if ($validated !== []) {
            $meetingRequest = $this->service->updateDetails($meetingRequest, $validated, $request->user());
        }

        return new MeetingRequestResource($meetingRequest);
    }

    /** DELETE /api/meeting-requests/{meetingRequest} — admin only, soft delete. 204. */
    public function destroy(Request $request, MeetingRequest $meetingRequest): JsonResponse
    {
        $this->authorize('delete', $meetingRequest);

        $this->service->delete($meetingRequest, $request->user());

        return response()->json(null, 204);
    }
}
