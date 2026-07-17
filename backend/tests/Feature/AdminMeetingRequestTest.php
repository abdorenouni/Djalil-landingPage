<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\MeetingRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMeetingRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_reassign_an_accepted_request(): void
    {
        $admin = User::factory()->admin()->create();
        [$owner, $newOwner] = User::factory()->employee()->count(2)->create();
        $request = MeetingRequest::factory()->accepted($owner)->create();

        $this->actingAs($admin)
            ->postJson("/api/admin/meeting-requests/{$request->reference}/reassign", [
                'employee_id' => $newOwner->id,
            ])
            ->assertOk()
            ->assertJsonPath('data.assigned_employee.id', $newOwner->id);

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'meeting_request.reassigned',
            'user_id' => $admin->id,
        ]);
    }

    public function test_employee_cannot_reassign(): void
    {
        $employee = User::factory()->employee()->create();
        $request = MeetingRequest::factory()->accepted()->create();

        $this->actingAs($employee)
            ->postJson("/api/admin/meeting-requests/{$request->reference}/reassign", [
                'employee_id' => $employee->id,
            ])
            ->assertForbidden();
    }

    public function test_pending_request_cannot_be_reassigned(): void
    {
        $admin = User::factory()->admin()->create();
        $employee = User::factory()->employee()->create();
        $request = MeetingRequest::factory()->create(); // pending

        $this->actingAs($admin)
            ->postJson("/api/admin/meeting-requests/{$request->reference}/reassign", [
                'employee_id' => $employee->id,
            ])
            ->assertStatus(409);
    }

    public function test_only_admin_can_delete(): void
    {
        $employee = User::factory()->employee()->create();
        $admin = User::factory()->admin()->create();
        $request = MeetingRequest::factory()->create();

        $this->actingAs($employee)
            ->deleteJson("/api/meeting-requests/{$request->reference}")
            ->assertForbidden();

        $this->actingAs($admin)
            ->deleteJson("/api/meeting-requests/{$request->reference}")
            ->assertNoContent();

        $this->assertSoftDeleted('meeting_requests', ['id' => $request->id]);
    }

    public function test_owner_can_update_but_stranger_cannot(): void
    {
        [$owner, $stranger] = User::factory()->employee()->count(2)->create();
        $request = MeetingRequest::factory()->accepted($owner)->create();

        $this->actingAs($stranger)
            ->patchJson("/api/meeting-requests/{$request->reference}", [
                'zoom_link' => 'https://zoom.us/j/123456',
            ])
            ->assertForbidden();

        $this->actingAs($owner)
            ->patchJson("/api/meeting-requests/{$request->reference}", [
                'zoom_link' => 'https://zoom.us/j/123456',
            ])
            ->assertOk()
            ->assertJsonPath('data.zoom_link', 'https://zoom.us/j/123456');
    }

    public function test_search_and_filters(): void
    {
        $admin = User::factory()->admin()->create();
        MeetingRequest::factory()->create(['full_name' => 'Mohamed Cherif', 'company' => 'Cherif Corp']);
        MeetingRequest::factory()->create(['full_name' => 'Autre Personne']);

        $this->actingAs($admin)
            ->getJson('/api/meeting-requests?search=cherif')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.full_name', 'Mohamed Cherif');
    }

    public function test_stats_and_export(): void
    {
        $admin = User::factory()->admin()->create();
        $employee = User::factory()->employee()->create();
        MeetingRequest::factory()->count(2)->create();
        MeetingRequest::factory()->accepted($employee)->create();

        $this->actingAs($admin)->getJson('/api/admin/stats')
            ->assertOk()
            ->assertJsonPath('by_status.pending', 2)
            ->assertJsonPath('by_status.accepted', 1);

        $response = $this->actingAs($admin)->get('/api/admin/meeting-requests/export');
        $response->assertOk();
        $this->assertStringContainsString('text/csv', $response->headers->get('content-type'));
    }
}
