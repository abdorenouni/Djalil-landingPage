<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Central audit trail. Every state change in the system funnels through here
 * so compliance questions ("who accepted this, when, from where?") have one
 * authoritative answer.
 */
class ActivityLogger
{
    public function log(
        string $action,
        ?Model $subject = null,
        ?User $actor = null,
        array $context = [],
    ): ActivityLog {
        return ActivityLog::create([
            'user_id' => $actor?->id ?? auth()->id(),
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'context' => $context ?: null,
            'ip_address' => request()?->ip(),
        ]);
    }
}
