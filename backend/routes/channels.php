<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
| Private channel carrying all meeting-request events. Any active staff
| member (employee or admin) may subscribe; visitors cannot — channel
| authorization runs through the session-authenticated /broadcasting/auth
| endpoint.
*/
Broadcast::channel('employees', function (User $user) {
    return $user->is_active;
});

Broadcast::channel('App.Models.User.{id}', function (User $user, int $id) {
    return $user->id === $id;
});
