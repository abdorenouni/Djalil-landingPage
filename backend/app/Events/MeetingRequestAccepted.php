<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\MeetingRequest;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Fired AFTER the accepting transaction commits. Dashboards remove/disable
 * the card; listeners fan out notifications. Carrying the acceptor lets
 * every client show "accepted by X" without an extra query.
 */
class MeetingRequestAccepted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public MeetingRequest $meetingRequest,
        public User $acceptedBy,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('employees')];
    }

    public function broadcastAs(): string
    {
        return 'meeting-request.accepted';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->meetingRequest->id,
            'reference' => $this->meetingRequest->reference,
            'status' => $this->meetingRequest->status->value,
            'accepted_by' => [
                'id' => $this->acceptedBy->id,
                'name' => $this->acceptedBy->name,
            ],
            'accepted_at' => $this->meetingRequest->accepted_at?->toIso8601String(),
        ];
    }
}
