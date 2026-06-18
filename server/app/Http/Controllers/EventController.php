<?php

namespace App\Http\Controllers;

use App\models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class EventController extends Controller
{
    /**
     * Exibir uma listagem dos eventos do usuário logado.
     */
    public function index()
    {
        // pega o usuário autenticado
        $user = Auth::user();

        // busca os eventos do usuário autenticado
        $eventosCriados = Event::where('user_id', $user->id)->get();

        // busca os eventos em que o usuário está colaborando
        $eventosColaborados = $user->eventosColaborados;

        // retorna a resposta JSON com os eventos do usuário
        return response()->json([
                'meus_eventos' => $eventosCriados,
                'colaboracoes' => $eventosColaborados
            ], 200);
    }

    /**
     * Criar um novo evento no banco de dados
     */
    public function store(Request $request)
    {
        // validação dos dados recebidos do React
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'data_inicio' => 'required|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
        ]);

        // Cria o evento atrelado ao usuário autenticado
        $evento = Event::create([
            'owner_id' => Auth::id(), // Pega o ID do token JWT
            'titulo' => $request->titulo,
            'descricao' => $request->descricao,
            'data_inicio' => $request->data_inicio,
            'data_fim' => $request->data_fim,
        ]);

        return response()->json([
            'message' => 'Evento criado com sucesso',
            'evento' => $evento
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
