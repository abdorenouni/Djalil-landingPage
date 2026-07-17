<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\MeetingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent to the employee who accepted (confirmation of ownership) and to
 * administrators (oversight). Channels adapt to the recipient — extend
 * via() to add Slack/SMS/etc. without touching call sites.
 */
class MeetingRequestAcceptedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public MeetingRequest $meetingRequest,
        public bool $forAdmin = false,
    ) {}

    public function via(object $notifiable): array
    {
        return $this->forAdmin ? ['database', 'mail'] : ['database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $r = $this->meetingRequest;

        $mail = (new MailMessage)
            ->subject("Demande de réunion acceptée — {$r->full_name}")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("La demande de {$r->full_name} ({$r->company}) a été acceptée par {$r->assignedEmployee?->name}.")
            ->line("Date souhaitée : {$r->preferred_date->format('d/m/Y')} à {$r->preferred_time}");

        if ($r->zoom_link) {
            $mail->line("Lien Zoom (client) : {$r->zoom_link}");
        }

        return $mail
            ->action('Voir la demande', url("/dashboard?highlight={$r->reference}"))
            ->line("Référence : {$r->reference}");
    }

    public function toArray(object $notifiable): array
    {
        // start_url (host control link) only makes sense for the assignee —
        // included here since the database channel is per-recipient and
        // only the accepting employee's notify() call passes forAdmin=false.
        return [
            'type' => 'meeting_request.accepted',
            'meeting_request_id' => $this->meetingRequest->id,
            'reference' => $this->meetingRequest->reference,
            'customer' => $this->meetingRequest->full_name,
            'accepted_by' => $this->meetingRequest->assignedEmployee?->name,
            'zoom_link' => $this->meetingRequest->zoom_link,
            'zoom_start_url' => $this->forAdmin ? null : $this->meetingRequest->zoom_start_url,
        ];
    }
}
