<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Events\MeetingRequestCreated;
use App\Models\MeetingRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class PublicMeetingRequestTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'full_name' => 'Nadia Bouaziz',
            'email' => 'nadia@example.dz',
            'phone' => '+213 550 12 34 56',
            'company' => 'Bouaziz Import',
            'preferred_date' => now()->addDays(10)->toDateString(),
            'preferred_time' => '14:30',
            'message' => 'Je souhaite discuter d\'un F4 dans ASTERIA.',
        ], $overrides);
    }

    public function test_visitor_can_create_meeting_request(): void
    {
        Event::fake([MeetingRequestCreated::class]);

        $response = $this->postJson('/api/meeting-requests', $this->validPayload());

        $response->assertCreated()->assertJsonStructure(['message', 'reference']);

        $this->assertDatabaseHas('meeting_requests', [
            'email' => 'nadia@example.dz',
            'status' => 'pending',
        ]);

        Event::assertDispatched(MeetingRequestCreated::class);
    }

    public function test_urgency_is_derived_from_preferred_date(): void
    {
        $this->postJson('/api/meeting-requests', $this->validPayload([
            'email' => 'urgent@example.dz',
            'preferred_date' => now()->addDay()->toDateString(),
        ]))->assertCreated();

        $this->assertSame(
            'high',
            MeetingRequest::where('email', 'urgent@example.dz')->first()->urgency->value,
        );
    }

    public function test_validation_rejects_bad_input(): void
    {
        $this->postJson('/api/meeting-requests', $this->validPayload([
            'email' => 'not-an-email',
            'preferred_date' => now()->subDay()->toDateString(), // past
            'phone' => 'abc',
        ]))->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'preferred_date', 'phone']);
    }

    public function test_public_endpoint_is_rate_limited(): void
    {
        RateLimiter::clear('meeting-requests-public:127.0.0.1');

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/meeting-requests', $this->validPayload([
                'email' => "burst{$i}@example.dz",
            ]))->assertCreated();
        }

        $this->postJson('/api/meeting-requests', $this->validPayload())
            ->assertStatus(429);
    }

    public function test_visitor_cannot_inject_protected_fields(): void
    {
        $this->postJson('/api/meeting-requests', $this->validPayload([
            'status' => 'accepted',
            'assigned_employee_id' => 1,
        ]))->assertCreated();

        $this->assertDatabaseHas('meeting_requests', [
            'email' => 'nadia@example.dz',
            'status' => 'pending',
            'assigned_employee_id' => null,
        ]);
    }
}
