<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Listar todos os usuários
     */
    public function index()
    {
        // Corrigido: 'name' para 'nome' conforme seu banco
        $usuarios = User::select('id', 'nome', 'email')->get();
        return response()->json($usuarios, 200);
    }

    /**
     * Cadastrar um novo usuário
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
            'id' => (string) Str::uuid(),
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
     * Exibir o perfil do usuário logado atualmente.
     */
    public function show(string $id)
    {
        if ($id != Auth::guard('api')->id()) {
            return response()->json(['message' => 'Acesso não autorizado ao Perfil'], 403);
        }

        $user = User::findOrFail($id);
        return response()->json($user, 200);
    }

    /**
     * Atualizar os dados do próprio perfil.
     */
    public function update(Request $request, string $id)
    {
        if ($id !== Auth::guard('api')->id()){
            return response()->json(['message' => 'Você não tem permissão para editar este perfil.'], 403);
        }

        $user = User::findOrFail($id);

        // Corrigido: Aspas duplas na interpolação do {$id} para o unique funcionar no update
        $request->validate([
            'nome' => 'sometimes|string|max:255',
            'email' => "sometimes|string|email|max:255|unique:usuarios,email,{$id}",
            'senha' => 'sometimes|string|min:6',
            'nascimento' => 'nullable|date|before:-18 years', // Mantendo a segurança de maioridade se alterar
        ]);

        if ($request->has('senha')) {
            $user->senha = Hash::make($request->senha);
        }

        $user->update($request->only(['nome', 'email', 'nascimento']));

        return response()->json([
            'message' => 'Perfil updated com sucesso!',
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'email' => $user->email,
                'nascimento' => $user->nascimento,
            ]
        ], 200);
    }

    /**
     * Excluir a conta do usuário logado atualmente.
     */
    public function destroy(string $id)
    {
        if ($id !== Auth::guard('api')->id()) {
            return response()->json(['message' => 'Você não tem permissão para excluir este perfil.'], 403);
        }
        
        $user = User::findOrFail($id);

        // Invalida o token JWT imediatamente
        Auth::guard('api')->logout();

        $user->delete();

        return response()->json([
            'message' => 'Usuário excluído com sucesso!'
        ], 200);
    }
}