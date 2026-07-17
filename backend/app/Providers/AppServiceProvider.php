<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Public visitor form: strict per-IP throttle. Every other abuse
        // vector requires authentication first.
        RateLimiter::for('meeting-requests-public', function (Request $request) {
            return Limit::perMinute((int) config('meeting-requests.public_rate_limit', 5))
                ->by($request->ip())
                ->response(fn () => response()->json([
                    'message' => 'Trop de demandes. Veuillez réessayer dans une minute.',
                ], 429));
        });

        // Authenticated API: generous but bounded, keyed per user.
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->user()?->id ?: $request->ip());
        });

        // Surface slow queries in production logs before customers notice.
        if ($this->app->isProduction()) {
            DB::listen(function ($query) {
                if ($query->time > 500) {
                    logger()->warning('slow-query', [
                        'sql' => $query->sql,
                        'ms' => $query->time,
                    ]);
                }
            });
        }
    }
}
