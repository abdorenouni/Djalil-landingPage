<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\MeetingRequestStatus;
use App\Enums\MeetingRequestUrgency;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class MeetingRequest extends Model
{
    /** @use HasFactory<\Database\Factories\MeetingRequestFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'company',
        'preferred_date',
        'preferred_time',
        'message',
        'urgency',
        'status',
        'zoom_link',
        'zoom_start_url',
        'scheduled_at',
        'source_ip',
    ];

    /**
     * Ownership fields are deliberately NOT mass-assignable: they may only
     * change through MeetingRequestService (locked transaction), never from
     * request input.
     */
    protected $guarded = [
        'id',
        'reference',
        'assigned_employee_id',
        'accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'status' => MeetingRequestStatus::class,
            'urgency' => MeetingRequestUrgency::class,
            'accepted_at' => 'datetime',
            'scheduled_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $request) {
            $request->reference ??= (string) Str::uuid();
        });
    }

    public function assignedEmployee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_employee_id');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', MeetingRequestStatus::Pending->value);
    }

    public function isPending(): bool
    {
        return $this->status === MeetingRequestStatus::Pending;
    }

    /** Route model binding on the public UUID, never the internal id. */
    public function getRouteKeyName(): string
    {
        return 'reference';
    }
}
