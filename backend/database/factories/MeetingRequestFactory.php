<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\MeetingRequestStatus;
use App\Enums\MeetingRequestUrgency;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\MeetingRequest>
 */
class MeetingRequestFactory extends Factory
{
    public function definition(): array
    {
        $preferred = fake()->dateTimeBetween('+1 day', '+3 weeks');

        return [
            'full_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => '+213 '.fake()->numerify('5## ## ## ##'),
            'company' => fake()->boolean(70) ? fake()->company() : null,
            'preferred_date' => $preferred->format('Y-m-d'),
            'preferred_time' => fake()->randomElement(['09:00', '10:30', '14:00', '15:30', '17:00']),
            'message' => fake()->boolean(80) ? fake()->realTextBetween(40, 200) : null,
            'urgency' => MeetingRequestUrgency::fromPreferredDate(
                \Illuminate\Support\Carbon::instance($preferred),
            )->value,
            'status' => MeetingRequestStatus::Pending->value,
        ];
    }

    public function accepted(?User $employee = null): static
    {
        return $this->state(fn () => [
            'status' => MeetingRequestStatus::Accepted->value,
            'assigned_employee_id' => $employee?->id ?? User::factory(),
            'accepted_at' => now()->subMinutes(fake()->numberBetween(2, 300)),
        ]);
    }

    public function completed(?User $employee = null): static
    {
        return $this->accepted($employee)->state(fn () => [
            'status' => MeetingRequestStatus::Completed->value,
        ]);
    }
}
