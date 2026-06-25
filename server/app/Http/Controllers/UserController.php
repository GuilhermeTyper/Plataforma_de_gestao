<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\Concerns\Has;

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
     * Exibir o perfil do usuario logado atualmente.
     */
    public function show(string $id)
    {
        if ($id != Auth::id()) {
            return response()->json(['message' => 'Acesso não autorizado ao Perfil'], 403);
        }

        $user = User::find($id);

        return response()->json($user, 200);
    }

    /**
     * Atualizar os dados do proprio perfil.
     */
    public function update(Request $request, string $id)
    {
        if ($id !== Auth::id()){
            return response()->json(['message' => 'Você não tem permissão para editar este perfil.'], 403);
        }

        $user = User::find($id);

        $request->validate([
            'nome' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|max:255|unique:usuarios,email,{$id}',
            'senha' => 'sometimes|string|min:6',
            'nascimento' => 'nullable|date',
        ]);

        // Se a senha foi informada, atualiza a senha do usuário
        if ($request->has('senha')) {
            $user->senha = Hash::make($request->senha);
        }

        $user->update($request->only(['nome', 'email', 'nascimento']));

        return response()->json([
            'message' => 'Perfil atualizado com sucesso!',
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'email' => $user->email,
                'nascimento' => $user->nascimento,
            ]
        ], 200);
    }

    /**
     * Excluir a conta do usuario logado atualmente.
     */
    public function destroy(string $id)
    {
        if ($id !== Auth::id()) {
            return response()->json(['message' => 'Você não tem permissão para excluir este perfil.'], 403);
        }
        $user = User::find($id);

        $user->delete();

        return response()->json([
            'message' => 'Usuário excluído com sucesso!'
        ], 200);

    }
}
