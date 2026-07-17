<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_requests', function (Blueprint $table) {
            $table->id();

            // Public identifier exposed to customers (confirmation emails,
            // support references) so internal sequential ids never leak.
            $table->uuid('reference')->unique();

            // Visitor-submitted fields.
            $table->string('full_name', 120);
            $table->string('email', 254);
            $table->string('phone', 30);
            $table->string('company', 120)->nullable();
            $table->date('preferred_date');
            $table->time('preferred_time');
            $table->text('message')->nullable();

            // Triage + lifecycle.
            $table->string('urgency', 10)->default('normal');
            $table->string('status', 20)->default('pending');

            // Ownership: exactly one employee after acceptance.
            $table->foreignId('assigned_employee_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestampTz('accepted_at')->nullable();

            // Where the meeting actually happens once scheduled.
            $table->string('zoom_link', 500)->nullable();
            $table->timestampTz('scheduled_at')->nullable();

            // Abuse forensics for the public endpoint.
            $table->string('source_ip', 45)->nullable();

            $table->timestampsTz();
            $table->softDeletesTz();

            // The dashboard's hot path: list pending, newest first.
            $table->index(['status', 'created_at']);
            $table->index('assigned_employee_id');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_requests');
    }
};
