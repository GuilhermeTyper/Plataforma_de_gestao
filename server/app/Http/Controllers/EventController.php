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
        //
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
