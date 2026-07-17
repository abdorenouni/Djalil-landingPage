<?php

declare(strict_types=1);

namespace App\Enums;

enum MeetingRequestStatus: string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * Transitions each status may legally move to. Guarding transitions in one
     * place keeps every mutation path (API, admin panel, console) consistent.
     */
    public function canTransitionTo(self $target): bool
    {
        return in_array($target, match ($this) {
            self::Pending => [self::Accepted, self::Cancelled],
            self::Accepted => [self::Completed, self::Cancelled, self::Pending],
            self::Completed, self::Cancelled => [],
        }, strict: true);
    }

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente',
            self::Accepted => 'Acceptée',
            self::Completed => 'Terminée',
            self::Cancelled => 'Annulée',
        };
    }
}
