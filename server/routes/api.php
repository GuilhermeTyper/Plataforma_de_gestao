<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\EventController;

Route::post('/cadastro', [UserController::class, 'store']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware(['auth:api'])->group(function () {
    Route::apiResource('usuarios', UserController::class)->except(['store']);
    // CRUD completo de eventos
    Route::apiResource('eventos', EventController::class);
    // CRUD completo de tarefas
    Route::apiResource('tarefas', TaskController::class);
}); 