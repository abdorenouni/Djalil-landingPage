<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\MeetingRequest;
use App\Models\User;

/**
 * Authorization matrix:
 *  - every active staff member sees the shared queue and may accept
 *  - only the owner (or an admin) may update a request after acceptance
 *  - destructive/administrative actions are admin-only
 */
class MeetingRequestPolicy
{
    /** Deactivated accounts lose all access, regardless of role. */
    public function before(User $user, string $ability): ?bool
    {
        return $user->is_active ? null : false;
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, MeetingRequest $meetingRequest): bool
    {
        return true;
    }

    public function accept(User $user, MeetingRequest $meetingRequest): bool
    {
        // Anyone active may try; the service's locked transaction is the
        // arbiter of who actually wins.
        return true;
    }

    public function update(User $user, MeetingRequest $meetingRequest): bool
    {
        return $user->isAdmin()
            || $meetingRequest->assigned_employee_id === $user->id;
    }

    public function delete(User $user, MeetingRequest $meetingRequest): bool
    {
        return $user->isAdmin();
    }

    public function reassign(User $user, MeetingRequest $meetingRequest): bool
    {
        return $user->isAdmin();
    }
}
