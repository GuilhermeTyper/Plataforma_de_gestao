<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'api' => 'Nome da Sua API',
        'status' => 'Rodando',
        'versao_laravel' => app()->version()
    ]);
});
