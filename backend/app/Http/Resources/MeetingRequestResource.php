<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\MeetingRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin MeetingRequest
 *
 * Single output shape for every API consumer. Internal columns (source_ip,
 * soft-delete timestamps) never leak.
 */
class MeetingRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'company' => $this->company,
            'preferred_date' => $this->preferred_date->toDateString(),
            'preferred_time' => $this->preferred_time,
            'message' => $this->message,
            'urgency' => $this->urgency->value,
            'status' => $this->status->value,
            'zoom_link' => $this->zoom_link,
            // Host control link — only ever shown to the assignee or an
            // admin, never to other employees browsing the shared queue.
            'zoom_start_url' => $this->when(
                $request->user()?->isAdmin() || $request->user()?->id === $this->assigned_employee_id,
                $this->zoom_start_url,
            ),
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'accepted_at' => $this->accepted_at?->toIso8601String(),
            'assigned_employee' => $this->whenLoaded(
                'assignedEmployee',
                fn () => $this->assignedEmployee === null ? null : [
                    'id' => $this->assignedEmployee->id,
                    'name' => $this->assignedEmployee->name,
                    'email' => $this->assignedEmployee->email,
                ],
            ),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
