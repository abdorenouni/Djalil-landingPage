<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS — cross-origin access for the React frontend
    |--------------------------------------------------------------------------
    | Credentialed (cookie) requests require an explicit origin — never "*".
    | The public form endpoint and the Sanctum session flow both pass here.
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        env('FRONTEND_URL', 'http://localhost:3000'),
        env('FRONTEND_URL_SECONDARY'),
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 3600,

    'supports_credentials' => true,

];
