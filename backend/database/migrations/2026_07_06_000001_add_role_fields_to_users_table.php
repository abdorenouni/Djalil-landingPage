<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Role as a string column (not a PG enum type) so adding roles later
            // is a data change, not a DDL migration. Application-level enum
            // (App\Enums\UserRole) guarantees integrity.
            $table->string('role', 20)->default('employee')->after('password');
            $table->string('phone', 30)->nullable()->after('role');
            // Deactivate accounts without deleting them (audit trail survives).
            $table->boolean('is_active')->default(true)->after('phone');

            $table->index('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
            $table->dropColumn(['role', 'phone', 'is_active']);
        });
    }
};
