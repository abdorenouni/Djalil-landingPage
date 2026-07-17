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

class MeetingRequestReassigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public MeetingRequest $meetingRequest,
        public User $newEmployee,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('employees')];
    }

    public function broadcastAs(): string
    {
        return 'meeting-request.reassigned';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->meetingRequest->id,
            'reference' => $this->meetingRequest->reference,
            'assigned_to' => [
                'id' => $this->newEmployee->id,
                'name' => $this->newEmployee->name,
            ],
        ];
    }
}
