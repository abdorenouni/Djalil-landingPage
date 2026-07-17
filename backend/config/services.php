<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Zoom — Server-to-Server OAuth app
    |--------------------------------------------------------------------------
    | Create at marketplace.zoom.us → Develop → Build App → Server-to-Server
    | OAuth, with the `meeting:write:admin` scope. Entirely optional: leave
    | blank and ZoomService::isConfigured() returns false, so the app keeps
    | working exactly as before (employees paste a link manually).
    */
    'zoom' => [
        'account_id' => env('ZOOM_ACCOUNT_ID'),
        'client_id' => env('ZOOM_CLIENT_ID'),
        'client_secret' => env('ZOOM_CLIENT_SECRET'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Odoo — CRM/ERP sync (disabled by default)
    |--------------------------------------------------------------------------
    | When enabled, accepted meeting requests are synced to Odoo as CRM
    | leads via its JSON-RPC API (see App\Services\OdooClient). Off by
    | default — flip ODOO_ENABLED=true once real Odoo credentials exist.
    */
    'odoo' => [
        'enabled' => env('ODOO_ENABLED', false),
        'url' => env('ODOO_URL'),
        'database' => env('ODOO_DATABASE'),
        'username' => env('ODOO_USERNAME'),
        'api_key' => env('ODOO_API_KEY'),
    ],

];
