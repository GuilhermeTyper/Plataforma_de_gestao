<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\EventController;

Route::post('/cadastro', [UserController::class, 'store']);
Route::post('/tarefas', [TaskController::class, 'store']);
Route::post('/eventos', [EventController::class, 'store']);

