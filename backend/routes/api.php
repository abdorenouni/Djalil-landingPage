<?php

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MeetingRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
| The visitor form. Throttled per IP (see AppServiceProvider) — the only
| unauthenticated write in the system.
*/

Route::post('/meeting-requests', [MeetingRequestController::class, 'store'])
    ->middleware('throttle:meeting-requests-public')
    ->name('meeting-requests.store');

/*
|--------------------------------------------------------------------------
| Authentication (Sanctum SPA — session cookies)
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1')
    ->name('login.attempt');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AuthController::class, 'me'])->name('me');

    /*
    |----------------------------------------------------------------------
    | Staff (employees + admins)
    |----------------------------------------------------------------------
    */

    Route::get('/meeting-requests', [MeetingRequestController::class, 'index'])
        ->name('meeting-requests.index');
    Route::get('/meeting-requests/{meetingRequest}', [MeetingRequestController::class, 'show'])
        ->name('meeting-requests.show');
    Route::post('/meeting-requests/{meetingRequest}/accept', [MeetingRequestController::class, 'accept'])
        ->name('meeting-requests.accept');
    Route::patch('/meeting-requests/{meetingRequest}', [MeetingRequestController::class, 'update'])
        ->name('meeting-requests.update');
    Route::delete('/meeting-requests/{meetingRequest}', [MeetingRequestController::class, 'destroy'])
        ->name('meeting-requests.destroy');

    Route::get('/notifications', function (\Illuminate\Http\Request $request) {
        return response()->json([
            'unread' => $request->user()->unreadNotifications()->limit(20)->get(),
        ]);
    })->name('notifications.index');

    Route::post('/notifications/mark-read', function (\Illuminate\Http\Request $request) {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'ok']);
    })->name('notifications.read');

    /*
    |----------------------------------------------------------------------
    | Administration
    |----------------------------------------------------------------------
    */

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::post('/meeting-requests/{meetingRequest}/reassign', [AdminController::class, 'reassign'])
            ->name('admin.meeting-requests.reassign');
        Route::get('/meeting-requests/export', [AdminController::class, 'export'])
            ->name('admin.meeting-requests.export');
        Route::get('/stats', [AdminController::class, 'stats'])->name('admin.stats');
        Route::get('/employees', [AdminController::class, 'employees'])->name('admin.employees');
        Route::get('/activity-logs', [AdminController::class, 'activityLogs'])->name('admin.activity-logs');
    });
});
