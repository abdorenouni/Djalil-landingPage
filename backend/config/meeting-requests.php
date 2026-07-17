<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Customer confirmation email
    |--------------------------------------------------------------------------
    | Send the visitor an email once an employee accepts their request.
    | Toggle without deploying: MEETING_REQUESTS_NOTIFY_CUSTOMER=false
    */

    'notify_customer' => env('MEETING_REQUESTS_NOTIFY_CUSTOMER', true),

    /*
    |--------------------------------------------------------------------------
    | Public form rate limit (submissions per minute per IP)
    |--------------------------------------------------------------------------
    */

    'public_rate_limit' => env('MEETING_REQUESTS_RATE_LIMIT', 5),

];
