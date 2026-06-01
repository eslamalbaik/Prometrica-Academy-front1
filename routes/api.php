<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('dashboard')->group(function () {
    Route::get('/stats', [DashboardController::class, 'getStats']);
    Route::get('/latest-students', [DashboardController::class, 'getLatestStudents']);
    Route::get('/latest-payments', [DashboardController::class, 'getLatestPayments']);

    Route::apiResource('courses', \App\Http\Controllers\Api\CourseController::class);
});
