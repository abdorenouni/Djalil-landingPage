<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\MeetingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Email confirmation to the visitor once their request is accepted.
 * Sent to a plain email address via Notification::route('mail', ...) —
 * customers are not users in the system.
 */
class CustomerMeetingRequestReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public MeetingRequest $meetingRequest) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $r = $this->meetingRequest;

        $mail = (new MailMessage)
            ->subject('Votre demande de réunion — Elite Promotion Immobilière')
            ->greeting("Bonjour {$r->full_name},")
            ->line('Votre demande de réunion a bien été prise en charge par notre équipe.')
            ->line("Date souhaitée : {$r->preferred_date->format('d/m/Y')} à {$r->preferred_time}")
            // The customer sees the company, never the individual employee's
            // name — real names stay internal (dashboard, staff/admin emails).
            ->line('Votre conseiller : ELITE ADMINISTRATION');

        if ($r->zoom_link) {
            $mail->action('Rejoindre la réunion Zoom', $r->zoom_link)
                ->line('Le lien reste valable jusqu\'au jour du rendez-vous.');
        } else {
            $mail->line('Nous vous contacterons très prochainement pour confirmer le créneau et vous transmettre le lien Zoom.');
        }

        return $mail
            ->line("Référence de votre demande : {$r->reference}")
            ->salutation('L\'équipe Elite Promotion Immobilière');
    }
}
