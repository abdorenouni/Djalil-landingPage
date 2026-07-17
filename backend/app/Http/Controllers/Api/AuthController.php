<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

/**
 * Session-based authentication (Sanctum SPA mode) for the employee dashboard.
 * Brute force is contained per email+IP; sessions are regenerated on login
 * (fixation) and invalidated on logout.
 */
class AuthController extends Controller
{
    public function login(Request $request, ActivityLogger $activity): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $throttleKey = strtolower($credentials['email']).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, maxAttempts: 5)) {
            throw ValidationException::withMessages([
                'email' => 'Trop de tentatives. Réessayez dans '.RateLimiter::availableIn($throttleKey).' secondes.',
            ]);
        }

        if (! Auth::attempt($credentials, remember: $request->boolean('remember'))) {
            RateLimiter::hit($throttleKey, decaySeconds: 60);

            throw ValidationException::withMessages([
                'email' => 'Identifiants incorrects.',
            ]);
        }

        if (! $request->user()->is_active) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => 'Ce compte est désactivé.',
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        $activity->log('auth.login', actor: $request->user());

        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role->value,
            ],
        ]);
    }

    public function logout(Request $request, ActivityLogger $activity): JsonResponse
    {
        $activity->log('auth.logout', actor: $request->user());

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role->value,
            ],
        ]);
    }
}
