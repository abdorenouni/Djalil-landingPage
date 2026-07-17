<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Thin wrapper around Odoo's JSON-RPC 2.0 external API
 * (https://www.odoo.com/documentation/latest/developer/reference/external_api.html).
 * No Odoo instance exists yet to test against — this is the plumbing so
 * wiring it up later is a config change, not a redesign. Every call site
 * must check isEnabled() first and wrap calls in try/catch: Odoo being
 * down must never block accepting a meeting request.
 */
class OdooClient
{
    public function isEnabled(): bool
    {
        return (bool) config('services.odoo.enabled')
            && filled(config('services.odoo.url'))
            && filled(config('services.odoo.database'))
            && filled(config('services.odoo.username'))
            && filled(config('services.odoo.api_key'));
    }

    /**
     * Create a CRM lead/opportunity from a meeting request. Returns the
     * Odoo record id.
     */
    public function createLead(array $fields): int
    {
        return (int) $this->call('crm.lead', 'create', [[$fields]]);
    }

    /** Add a note to an existing lead — used for later syncs (e.g. reassignment). */
    public function logNoteOnLead(int $leadId, string $note): void
    {
        $this->call('crm.lead', 'message_post', [[$leadId]], ['body' => $note]);
    }

    private function call(string $model, string $method, array $args, array $kwargs = []): mixed
    {
        $uid = $this->authenticate();

        $response = Http::post($this->endpoint(), [
            'jsonrpc' => '2.0',
            'method' => 'call',
            'params' => [
                'service' => 'object',
                'method' => 'execute_kw',
                'args' => [
                    config('services.odoo.database'),
                    $uid,
                    config('services.odoo.api_key'),
                    $model,
                    $method,
                    $args,
                    $kwargs,
                ],
            ],
        ]);

        $body = $response->json();

        if ($response->failed() || isset($body['error'])) {
            throw new RuntimeException('Odoo API error: '.json_encode($body['error'] ?? $response->body()));
        }

        return $body['result'] ?? null;
    }

    /** Session uid, cached — re-authenticating on every call would be wasteful. */
    private function authenticate(): int
    {
        return Cache::remember('odoo.uid', now()->addHour(), function () {
            $response = Http::post($this->endpoint(), [
                'jsonrpc' => '2.0',
                'method' => 'call',
                'params' => [
                    'service' => 'common',
                    'method' => 'authenticate',
                    'args' => [
                        config('services.odoo.database'),
                        config('services.odoo.username'),
                        config('services.odoo.api_key'),
                        [],
                    ],
                ],
            ]);

            $uid = $response->json('result');

            if (! $uid) {
                throw new RuntimeException('Odoo authentication failed — check ODOO_* credentials.');
            }

            return (int) $uid;
        });
    }

    private function endpoint(): string
    {
        return rtrim((string) config('services.odoo.url'), '/').'/jsonrpc';
    }
}
