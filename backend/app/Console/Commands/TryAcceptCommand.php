<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Exceptions\MeetingRequestConflictException;
use App\Models\MeetingRequest;
use App\Models\User;
use App\Services\MeetingRequestService;
use Illuminate\Console\Command;

/**
 * Concurrency harness: run N copies of this command in parallel against the
 * same request id to prove exactly one acceptance wins. Not used by the
 * application itself — kept for load/regression verification.
 *
 *   php artisan meeting-requests:try-accept {request_id} {employee_id}
 */
class TryAcceptCommand extends Command
{
    protected $signature = 'meeting-requests:try-accept {request_id} {employee_id}';

    protected $description = 'Attempt to accept a meeting request as an employee (race-condition harness)';

    public function handle(MeetingRequestService $service): int
    {
        $request = MeetingRequest::findOrFail((int) $this->argument('request_id'));
        $employee = User::findOrFail((int) $this->argument('employee_id'));

        try {
            $service->accept($request, $employee);
            $this->line("WIN employee={$employee->id}");
        } catch (MeetingRequestConflictException) {
            $this->line("CONFLICT employee={$employee->id}");
        }

        return self::SUCCESS;
    }
}
