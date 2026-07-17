<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\MeetingRequest;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * A visitor submitted the form — every connected dashboard gets the new
 * card pushed instantly. Broadcast on a private channel: request data
 * contains PII and must never reach unauthenticated sockets.
 */
class MeetingRequestCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public MeetingRequest $meetingRequest) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('employees')];
    }

    public function broadcastAs(): string
    {
        return 'meeting-request.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->meetingRequest->id,
            'reference' => $this->meetingRequest->reference,
            'full_name' => $this->meetingRequest->full_name,
            'company' => $this->meetingRequest->company,
            'preferred_date' => $this->meetingRequest->preferred_date->toDateString(),
            'preferred_time' => $this->meetingRequest->preferred_time,
            'urgency' => $this->meetingRequest->urgency->value,
            'status' => $this->meetingRequest->status->value,
            'created_at' => $this->meetingRequest->created_at->toIso8601String(),
        ];
    }
}
