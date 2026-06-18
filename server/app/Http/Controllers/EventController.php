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
        // Busca o evento pelo ID, incluindo as tarefas e colaboradores relacionados
        $evento = Event::with(['tarefas', 'colaboradores'])->find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento não encontrado'], 404);
        }

        $userId = Auth::id();
        $isColaborador = $evento->colaboradores()->where('id_usuario', $userId)->exists();

        if ($evento->owner_id !== $userId && !$isColaborador) {
            return response()->json(['message' => 'Você não tem permissão para acessar este evento'], 403);
        }

        return response()->json($evento, 200);
    }

    /**
     * Atualizar um evento específico.
     */
    public function update(Request $request, string $id)
    {
        $evento = Event::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento não encontrado'], 404);
        }
        
        // verifica se o usuário autenticado é o dono do evento
        if ($evento->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Apenas o criador do evento pode editá-lo'], 403);
        }

        $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descricao' => 'nullable|string',
            'data_inicio' => 'sometimes|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',

        ]);

        // Atualiza apenas os campos enviados
        $evento->update($request->only([
            'titulo',
            'descricao',
            'data_inicio',
            'data_fim',
        ]));

        return response()->json([
            'message' => 'Evento atualizado com sucesso',
            'evento' => $evento
        ], 200);
    }

    /**
     * Remover um evento específico do banco de dados.
     */
    public function destroy(string $id)
    {
        $evento = Event::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento não encontrado'], 404);
        }

        // verifica se o usuário autenticado é o dono do evento
        if ($evento->owner_id !== Auth::id()) {
            return response()->json(['message' => 'Apenas o criador do evento pode removê-lo'], 403);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento removido com sucesso'], 200);
    }
}
