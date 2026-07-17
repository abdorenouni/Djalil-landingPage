<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            // Who acted. Nullable: visitor-triggered events have no user.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Machine-readable action key, e.g. "meeting_request.accepted".
            $table->string('action', 60);

            // What was acted upon (polymorphic so future domains — projects,
            // contracts, CRM entities — log through the same table).
            $table->nullableMorphs('subject');

            // Structured context: old/new values, actor IP, etc.
            $table->jsonb('context')->nullable();

            $table->string('ip_address', 45)->nullable();
            $table->timestampTz('created_at')->useCurrent();

            $table->index('action');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
