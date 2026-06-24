<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Listar todos os usuarios
     */
    public function index()
    {
        // Seleciona apenas os campos id, name e email para não expor informações sensíveis
        $usuarios = User::select('id', 'name', 'email')->get();
        return response()->json($usuarios, 200);
    }

    /**
     * Cadastrar um novo usuario
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuarios,email',
            'senha' => 'required|string|min:6',
            'nascimento' => 'required|date|before:-18 years',
        ]);

        $usuario = User::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'senha' => Hash::make($request->senha),
            'nascimento' => $request->nascimento,
        ]);

        return response()->json([
            'message' => 'Usuário cadastrado com sucesso!',
            'user' => [
                'id' => $usuario->id,
                'nome' => $usuario->nome,
                'email' => $usuario->email,
            ]
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
