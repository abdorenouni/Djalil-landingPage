<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\MeetingRequestCreated;
use App\Services\OdooClient;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Throwable;

/**
 * Mirrors every new meeting request into Odoo as a CRM lead, so the sales
 * team's existing pipeline (Odoo) and this site's dashboard both show the
 * same incoming demand — no double data entry.
 *
 * A no-op until ODOO_ENABLED=true and the four ODOO_* env vars are set
 * (config/services.php). Disabled by default: nothing changes for a site
 * that never configures Odoo.
 */
class SyncMeetingRequestToOdoo implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 3;

    public function __construct(private readonly OdooClient $odoo) {}

    public function handle(MeetingRequestCreated $event): void
    {
        if (! $this->odoo->isEnabled()) {
            return;
        }

        try {
            $r = $event->meetingRequest;

            $this->odoo->createLead([
                'name' => "Demande de réunion — {$r->full_name}",
                'contact_name' => $r->full_name,
                'email_from' => $r->email,
                'phone' => $r->phone,
                'partner_name' => $r->company,
                'description' => $r->message,
                // Odoo convention: date_deadline as the "expected by" date.
                'date_deadline' => $r->preferred_date->toDateString(),
            ]);
        } catch (Throwable $e) {
            report($e);
        }
    }
}
