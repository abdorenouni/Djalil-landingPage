<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\MeetingRequestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Authenticated update. Authorization is enforced by MeetingRequestPolicy
 * in the controller; this class only validates shape.
 */
class UpdateMeetingRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(MeetingRequestStatus::class)],
            // Manual override / fallback — used when auto-creation via the
            // Zoom API is not configured or failed, so staff can still paste
            // a link created by hand.
            'zoom_link' => ['sometimes', 'nullable', 'url:https', 'max:500'],
            'zoom_start_url' => ['sometimes', 'nullable', 'url:https', 'max:500'],
            'scheduled_at' => ['sometimes', 'nullable', 'date', 'after:now'],
        ];
    }
}
