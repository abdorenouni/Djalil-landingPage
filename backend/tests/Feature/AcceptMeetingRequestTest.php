<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Events\MeetingRequestAccepted;
use App\Models\MeetingRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class AcceptMeetingRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_can_accept_a_pending_request(): void
    {
        Event::fake([MeetingRequestAccepted::class]);

        $employee = User::factory()->employee()->create();
        $request = MeetingRequest::factory()->create();

        $this->actingAs($employee)
            ->postJson("/api/meeting-requests/{$request->reference}/accept")
            ->assertOk()
            ->assertJsonPath('data.status', 'accepted')
            ->assertJsonPath('data.assigned_employee.id', $employee->id);

        $request->refresh();
        $this->assertSame($employee->id, $request->assigned_employee_id);
        $this->assertNotNull($request->accepted_at);

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'meeting_request.accepted',
            'user_id' => $employee->id,
            'subject_id' => $request->id,
        ]);

        Event::assertDispatched(MeetingRequestAccepted::class);
    }

    public function test_second_employee_gets_conflict(): void
    {
        [$first, $second] = User::factory()->employee()->count(2)->create();
        $request = MeetingRequest::factory()->create();

        $this->actingAs($first)
            ->postJson("/api/meeting-requests/{$request->reference}/accept")
            ->assertOk();

        $this->actingAs($second)
            ->postJson("/api/meeting-requests/{$request->reference}/accept")
            ->assertStatus(409)
            ->assertJsonPath('message', 'This request has already been accepted.')
            ->assertJsonPath('accepted_by', $first->name);

        // Ownership never moved.
        $this->assertSame($first->id, $request->refresh()->assigned_employee_id);
    }

    /**
     * Serialization proof on the real engine: while one transaction holds
     * FOR UPDATE on the row, a competing transaction cannot read it with
     * FOR UPDATE — it blocks until commit (here: times out). This is the
     * property the whole accept flow rests on.
     */
    public function test_row_lock_actually_blocks_concurrent_acceptors(): void
    {
        // Two genuinely independent PDO connections. The row must be COMMITTED
        // (RefreshDatabase's wrapping transaction would hide it from the rival),
        // so both insert and cleanup happen on the rival connection.
        config([
            'database.connections.pgsql_rival' => config('database.connections.pgsql'),
            'database.connections.pgsql_holder' => config('database.connections.pgsql'),
        ]);
        $rival = DB::connection('pgsql_rival');
        $holder = DB::connection('pgsql_holder');

        $id = $rival->table('meeting_requests')->insertGetId([
            'reference' => (string) \Illuminate\Support\Str::uuid(),
            'full_name' => 'Lock Test',
            'email' => 'lock@test.dz',
            'phone' => '+213 550 00 00 00',
            'preferred_date' => now()->addWeek()->toDateString(),
            'preferred_time' => '10:00',
            'urgency' => 'normal',
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        try {
            // Holder takes the row lock, exactly like the accept flow does.
            $holder->beginTransaction();
            $holder->table('meeting_requests')->where('id', $id)->lockForUpdate()->first();

            // Rival tries to take the same lock: PostgreSQL blocks it until
            // the holder commits — with a timeout, that surfaces as an error.
            $rival->statement("SET lock_timeout = '250ms'");
            $rival->beginTransaction();

            $blocked = false;
            try {
                $rival->table('meeting_requests')->where('id', $id)->lockForUpdate()->first();
            } catch (\Illuminate\Database\QueryException $e) {
                $blocked = str_contains($e->getMessage(), 'lock timeout');
            }
            $rival->rollBack();

            $this->assertTrue($blocked, 'FOR UPDATE did not serialize concurrent acceptors.');
        } finally {
            $holder->rollBack();
            $rival->statement("SET lock_timeout = 0");
            $rival->table('meeting_requests')->where('id', $id)->delete();
        }
    }

    public function test_guest_cannot_accept(): void
    {
        $request = MeetingRequest::factory()->create();

        $this->postJson("/api/meeting-requests/{$request->reference}/accept")
            ->assertUnauthorized();
    }

    public function test_deactivated_employee_cannot_accept(): void
    {
        $employee = User::factory()->employee()->inactive()->create();
        $request = MeetingRequest::factory()->create();

        $this->actingAs($employee)
            ->postJson("/api/meeting-requests/{$request->reference}/accept")
            ->assertForbidden();
    }
}
