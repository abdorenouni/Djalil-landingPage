<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\MeetingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Creates real Zoom meetings via a Server-to-Server OAuth app (Zoom's
 * current recommended flow — the old JWT app type is deprecated/removed).
 *
 * Setup (see docs/DEPLOYMENT.md): create a Server-to-Server OAuth app at
 * marketplace.zoom.us, grant the `meeting:write:admin` scope, and put the
 * three resulting values in .env. Fully optional — every call site checks
 * isConfigured() first, so a site with no Zoom app just skips this feature.
 */
class ZoomService
{
    private const TOKEN_CACHE_KEY = 'zoom.access_token';

    public function isConfigured(): bool
    {
        return filled(config('services.zoom.account_id'))
            && filled(config('services.zoom.client_id'))
            && filled(config('services.zoom.client_secret'));
    }

    /**
     * Create a Zoom meeting for the given request's preferred date/time and
     * return the join + start URLs. Throws on any failure — callers must
     * catch, since a Zoom outage must never block accepting a request.
     */
    public function createMeetingFor(MeetingRequest $request): array
    {
        $startAt = $request->preferred_date->copy()->setTimeFromTimeString(
            (string) $request->preferred_time,
        );

        $response = Http::withToken($this->accessToken())
            ->acceptJson()
            ->post('https://api.zoom.us/v2/users/me/meetings', [
                'topic' => "Elite Promotion — {$request->full_name}",
                'type' => 2, // scheduled meeting
                'start_time' => $startAt->utc()->format('Y-m-d\TH:i:s\Z'),
                'duration' => 30,
                'timezone' => 'Africa/Algiers',
                'agenda' => $request->message ?: 'Réunion Elite Promotion Immobilière',
                'settings' => [
                    'join_before_host' => false,
                    'waiting_room' => true,
                    'approval_type' => 2, // no registration required
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException(
                'Zoom API error ('.$response->status().'): '.$response->body(),
            );
        }

        return [
            'join_url' => $response->json('join_url'),
            'start_url' => $response->json('start_url'),
        ];
    }

    /** Server-to-Server OAuth token, cached for its lifetime (minus a safety margin). */
    private function accessToken(): string
    {
        return Cache::remember(self::TOKEN_CACHE_KEY, now()->addMinutes(50), function () {
            $response = Http::asForm()
                ->withBasicAuth(
                    (string) config('services.zoom.client_id'),
                    (string) config('services.zoom.client_secret'),
                )
                ->post('https://zoom.us/oauth/token', [
                    'grant_type' => 'account_credentials',
                    'account_id' => config('services.zoom.account_id'),
                ]);

            if ($response->failed()) {
                throw new RuntimeException(
                    'Zoom OAuth error ('.$response->status().'): '.$response->body(),
                );
            }

            return (string) $response->json('access_token');
        });
    }
}
