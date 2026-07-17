<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Account bootstrap only — no demo meeting requests are generated here
     * anymore. A production database must start with zero fake customer
     * data; `php artisan migrate --force` alone is enough to go live.
     *
     * Employee accounts (Sarah/Karim/Yacine) are placeholders so the shared
     * queue and the accept race can be tested with more than one person —
     * replace them with the client's real staff before launch (Studio-side
     * equivalent: create the real users, then delete these three).
     */
    public function run(): void
    {
        User::factory()->admin()->create([
            'name' => 'Administrateur Elite',
            'email' => 'mar.elitee@gmail.com',
            'password' => '1234',
        ]);

        collect([
            ['name' => 'Sarah Benali', 'email' => 'sarah@elite-promotion.dz'],
            ['name' => 'Karim Haddad', 'email' => 'karim@elite-promotion.dz'],
            ['name' => 'Yacine Merbah', 'email' => 'yacine@elite-promotion.dz'],
        ])->each(fn (array $e) => User::factory()->employee()->create($e));

        $this->command?->info('Seeded. Admin: mar.elitee@gmail.com / 1234 — employees: password "password".');
    }
}
