<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Listar todas as tarefas de um evento específico.
     */
    public function index(Request $request)
    {
        // Forçamos o front-end a passar o id_evento na query string (ex: /api/tarefas?id_evento=1)
        $request->validate([
            'id_evento' => 'required|integer|exists:eventos,id',
        ]);

        $idEvento = $request->query('id_evento');
        $evento = Event::find($idEvento);

        // Segurança: Verifica se quem está listando é o dono ou colaborador do evento
        $userId = Auth::id();
        $isColaborador = $evento->colaboradores()->where('id_usuario', $userId)->exists();

        if ($evento->owner_id !== $userId && !$isColaborador) {
            return response()->json(['message' => 'Você não tem permissão para ver as tarefas deste evento.'], 403);
        }

        $tarefas = Task::where('id_evento', $idEvento)->get();

        return response()->json($tarefas, 200);
    }

    /**
     * Criar uma nova tarefa vinculada a um evento.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_evento' => 'required|integer|exists:eventos,id',
            'atribuída_a' => 'nullable|uuid|exists:usuarios,id',
            'titulo' => 'required|string|max:255',
            'texto_sentimento' => 'nullable|string', // Alinhado com a proposta do Mood!
            'status' => 'sometimes|in:pendente,em_andamento,concluído',
            'priority' => 'sometimes|integer|between:1,5',
        ]);

        $evento = Event::find($request->id_evento);

        // Segurança: Apenas o dono ou um colaborador pode adicionar tarefas ao evento
        $userId = Auth::id();
        $isColaborador = $evento->colaboradores()->where('id_usuario', $userId)->exists();

        if ($evento->owner_id !== $userId && !$isColaborador) {
            return response()->json(['message' => 'Você não tem permissão para adicionar tarefas neste evento.'], 403);
        }

        $tarefa = Task::create([
            'id_evento' => $request->id_evento,
            'atribuída_a' => $request->atribuída_a,
            'titulo' => $request->titulo,
            'texto_sentimento' => $request->texto_sentimento,
            'status' => $request->status ?? 'pendente',
            'priority' => $request->priority ?? 3,
        ]);

        return response()->json([
            'message' => 'Tarefa criada com sucesso!',
            'tarefa' => $tarefa
        ], 210);
    }

    /**
     * Exibir os detalhes de uma tarefa específica.
     */
    public function show(string $id)
    {
        $tarefa = Task::with('evento')->find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa não encontrada.'], 404);
        }

        return response()->json($tarefa, 200);
    }

    /**
     * Atualizar os dados de uma tarefa (ex: mudar status ou atualizar o sentimento).
     */
    public function update(Request $request, string $id)
    {
        $tarefa = Task::find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa não encontrada.'], 404);
    }

    // 1. Buscar o evento dono desta tarefa para checar as permissões
    $evento = Event::find($tarefa->id_evento);
    $userId = Auth::id();

    // 2. Descobrir a função do usuário atual neste evento
    $funcaoUsuario = null;

    if ($evento->owner_id === $userId) {
        $funcaoUsuario = 'criador';
    } else {
        // Busca o registro na tabela pivô
        $colaboracao = $evento->colaboradores()
            ->where('id_usuario', $userId)
            ->first();

        if ($colaboracao) {
            $funcaoUsuario = $colaboracao->pivot->funcao; // 'editor' ou 'visualizador'
        }
    }

    // Se o usuário não é criador, nem editor, nem visualizador, ele não tem acesso ao evento
    if (!$funcaoUsuario) {
        return response()->json(['message' => 'Você não tem permissão para alterar nada nesta tarefa.'], 403);
    }

    // 3. Validação dos dados
    $request->validate([
        'atribuída_a' => 'nullable|uuid|exists:usuarios,id',
        'titulo' => 'sometimes|string|max:255',
        'texto_sentimento' => 'nullable|string',
        'esclarecimento' => 'nullable|string', // Caso adicione este campo no futuro
        'status' => 'sometimes|in:pendente,em_andamento,concluído',
        'priority' => 'sometimes|integer|between:1,5',
    ]);

    // 4. Aplicar a regra de permissão por cargo
    if ($funcaoUsuario === 'visualizador') {
        // Se for apenas visualizador, filtramos o request para aceitar SÓ o foco do projeto
        $dadosParaAtualizar = $request->only(['texto_sentimento', 'esclarecimento']);
        
        if (empty($dadosParaAtualizar)) {
            return response()->json([
                'message' => 'Como visualizador, você só tem permissão para editar o sentimento e o esclarecimento da tarefa.'
            ], 403);
        }
    } else {
        // Se for criador ou editor, aceita tudo o que foi enviado
        $dadosParaAtualizar = $request->only([
            'atribuída_a', 
            'titulo', 
            'texto_sentimento', 
            'esclarecimento',
            'status', 
            'priority'
        ]);
    }

    // 5. Atualiza a tarefa com o array filtrado pelas permissões
    $tarefa->update($dadosParaAtualizar);

    return response()->json([
        'message' => "Tarefa atualizada com sucesso como {$funcaoUsuario}!",
        'tarefa' => $tarefa
    ], 200);
    }

    /**
     * Deletar uma tarefa.
     */
    public function destroy(string $id)
    {
        $tarefa = Task::find($id);

        if (!$tarefa) {
            return response()->json(['message' => 'Tarefa não encontrada.'], 404);
        }

        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluída com sucesso!'], 200);
    }
}