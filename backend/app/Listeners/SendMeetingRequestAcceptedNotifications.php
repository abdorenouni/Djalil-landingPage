<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\MeetingRequestAccepted;
use App\Models\User;
use App\Notifications\CustomerMeetingRequestReceived;
use App\Notifications\MeetingRequestAcceptedNotification;
use App\Services\ZoomService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use Throwable;

/**
 * Fan-out point for acceptance side effects. Queued: the accepting request
 * returns immediately; neither Zoom nor notification delivery can slow down
 * or fail the user-facing transaction. Add new recipients/channels/side
 * effects here — never in the service.
 */
class SendMeetingRequestAcceptedNotifications implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 3;

    public function __construct(private readonly ZoomService $zoom) {}

    public function handle(MeetingRequestAccepted $event): void
    {
        $request = $event->meetingRequest->loadMissing('assignedEmployee');

        // 0. Create the real Zoom meeting first (if a Zoom app is configured)
        //    so the notifications below can include the actual join link
        //    instead of "we'll send it later". Never let a Zoom outage break
        //    acceptance — log and continue with zoom_link left empty; staff
        //    can still paste a link manually via the dashboard.
        if ($this->zoom->isConfigured() && ! $request->zoom_link) {
            try {
                $meeting = $this->zoom->createMeetingFor($request);
                $request->forceFill([
                    'zoom_link' => $meeting['join_url'],
                    'zoom_start_url' => $meeting['start_url'],
                ])->save();
            } catch (Throwable $e) {
                report($e);
            }
        }

        // 1. The employee who accepted — ownership confirmation + host link.
        $event->acceptedBy->notify(new MeetingRequestAcceptedNotification($request));

        // 2. Every administrator — oversight.
        Notification::send(
            User::query()->admins()->active()->get(),
            new MeetingRequestAcceptedNotification($request, forAdmin: true),
        );

        // 3. The customer — optional, controlled by config so ops can switch
        //    it off without a deploy.
        if (config('meeting-requests.notify_customer', true)) {
            Notification::route('mail', $request->email)
                ->notify(new CustomerMeetingRequestReceived($request));
        }
    }
}
