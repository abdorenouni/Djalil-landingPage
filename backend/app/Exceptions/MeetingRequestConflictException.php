<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Models\MeetingRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Thrown when an action races against a state change — e.g. two employees
 * accepting the same request. Renders as 409 Conflict.
 */
class MeetingRequestConflictException extends Exception
{
    public function __construct(
        string $message,
        public readonly ?MeetingRequest $meetingRequest = null,
    ) {
        parent::__construct($message);
    }

    public static function alreadyAccepted(MeetingRequest $request): self
    {
        return new self('This request has already been accepted.', $request);
    }

    public static function invalidTransition(MeetingRequest $request, string $to): self
    {
        return new self(
            "Cannot move this request from '{$request->status->value}' to '{$to}'.",
            $request,
        );
    }

    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'status' => $this->meetingRequest?->status->value,
            'accepted_by' => $this->meetingRequest?->assignedEmployee?->name,
        ], JsonResponse::HTTP_CONFLICT);
    }
}
