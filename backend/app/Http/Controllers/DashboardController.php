<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Server-rendered shell for the staff dashboard. All data flows through the
 * same REST API the tests cover — these routes only serve the HTML shell,
 * so there is exactly one code path for business logic.
 */
class DashboardController extends Controller
{
    public function login(Request $request): View|RedirectResponse
    {
        return $request->user()
            ? redirect()->route('dashboard')
            : view('auth.login');
    }

    public function dashboard(Request $request): View
    {
        return view('dashboard', [
            'user' => $request->user(),
            'reverb' => $this->reverbClientConfig(),
        ]);
    }

    public function admin(Request $request): View
    {
        abort_unless($request->user()->isAdmin(), 403);

        return view('admin', [
            'user' => $request->user(),
            'reverb' => $this->reverbClientConfig(),
        ]);
    }

    /** Client-side Echo needs the public Reverb credentials only. */
    private function reverbClientConfig(): array
    {
        return [
            'key' => config('broadcasting.connections.reverb.key'),
            'host' => config('broadcasting.connections.reverb.options.host'),
            'port' => (int) config('broadcasting.connections.reverb.options.port'),
            'scheme' => config('broadcasting.connections.reverb.options.scheme'),
        ];
    }
}
