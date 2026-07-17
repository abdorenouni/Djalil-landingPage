<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_requests', function (Blueprint $table) {
            // zoom_link (existing column) is the customer-facing join URL.
            // zoom_start_url is the host link — only ever shown to staff,
            // never exposed to the public API response for a visitor.
            $table->string('zoom_start_url', 500)->nullable()->after('zoom_link');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_requests', function (Blueprint $table) {
            $table->dropColumn('zoom_start_url');
        });
    }
};
