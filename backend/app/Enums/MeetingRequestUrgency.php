<?php

declare(strict_types=1);

namespace App\Enums;

enum MeetingRequestUrgency: string
{
    case Low = 'low';
    case Normal = 'normal';
    case High = 'high';

    /**
     * Urgency is derived from how soon the visitor wants to meet, so employees
     * can triage without the visitor having to self-assess importance.
     */
    public static function fromPreferredDate(\DateTimeInterface $preferred): self
    {
        $days = (int) now()->startOfDay()->diffInDays(
            \Illuminate\Support\Carbon::instance($preferred)->startOfDay(),
            absolute: false,
        );

        return match (true) {
            $days <= 2 => self::High,
            $days <= 7 => self::Normal,
            default => self::Low,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Low => 'Basse',
            self::Normal => 'Normale',
            self::High => 'Haute',
        };
    }
}
