<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\EventController;

Route::post('/cadastro', [UserController::class, 'store']);

Route::middleware(['auth:api'])->group(function () {
    Route::apiResource('/eventos', EventController::class);
    Route::apiResource('/tarefas', TaskController::class);
}); 