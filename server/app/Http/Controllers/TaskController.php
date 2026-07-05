<?php

namespace App\Http\Controllers;

use App\Models\Task; // Ou 'Tarefa' conforme o nome do seu Model
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Criar uma nova tarefa em um evento.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_evento' => 'required|exists:eventos,id',
            'titulo' => 'required|string|max:255',
            'atribuída_a' => 'nullable|exists:usuarios,id',
            'status' => 'required|string',
            'priority' => 'required|integer',
        ]);

        $evento = Event::findOrFail($request->id_evento);
        $userId = Auth::guard('api')->id();

        $funcao = $evento->colaboradores()->where('id_usuario', $userId)->value('funcao');

        // Impede que um visualizador crie tarefas
        if ($evento->owner_id !== $userId && $funcao !== 'editor') {
            return response()->json(['message' => 'Você não tem permissão para criar tarefas neste evento.'], 403);
        }

        $tarefa = Task::create($request->all());

        return response()->json([
            'message' => 'Tarefa criada com sucesso!',
            'tarefa' => $tarefa
        ], 201);
    }

    /**
     * Atualizar uma tarefa (Onde roda a trava de permissões).
     */
    public function update(Request $request, string $id)
    {
        $tarefa = Task::findOrFail($id);
        $evento = Event::findOrFail($tarefa->id_evento);
        $userId = Auth::guard('api')->id();

        $ehDono = $evento->owner_id === $userId;
        $funcao = $evento->colaboradores()->where('id_usuario', $userId)->value('funcao');

        if (!$ehDono && !$funcao) {
            return response()->json(['message' => 'Você não faz parte deste evento.'], 403);
        }

        // 🔒 SE FOR APENAS VISUALIZADOR: Bloqueia alteração estrutural
        if ($funcao === 'visualizador' && !$ehDono) {
            
            // Permite validar apenas as colunas de sentimento e ajuste
            $request->validate([
                'texto_sentimento' => 'required|string',
                'esclarecimentos_ajuste' => 'nullable|string',
            ]);

            // Atualiza estritamente os campos permitidos
            $tarefa->update($request->only(['texto_sentimento', 'esclarecimentos_ajuste']));

            return response()->json([
                'message' => 'Atualizado com sucesso! Por sua função ser visualizador, apenas seu sentimento foi registrado.',
                'tarefa' => $tarefa
            ], 200);
        }

        // 🛡️ SE FOR DONO OU EDITOR: Permissão total
        $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'status' => 'sometimes|string',
            'priority' => 'sometimes|integer',
            'atribuída_a' => 'sometimes|exists:usuarios,id',
            'texto_sentimento' => 'sometimes|string',
            'esclarecimentos_ajuste' => 'sometimes|string',
        ]);

        $tarefa->update($request->all());

        return response()->json([
            'message' => 'Tarefa atualizada com sucesso pelo administrador/editor!',
            'tarefa' => $tarefa
        ], 200);
    }

    /**
     * Excluir uma tarefa.
     */
    public function destroy(string $id)
    {
        $tarefa = Task::findOrFail($id);
        $evento = Event::findOrFail($tarefa->id_evento);
        $userId = Auth::guard('api')->id();

        $funcao = $evento->colaboradores()->where('id_usuario', $userId)->value('funcao');

        // Apenas o dono ou editores podem remover tarefas do quadro
        if ($evento->owner_id !== $userId && $funcao !== 'editor') {
            return response()->json(['message' => 'Você não tem permissão para excluir esta tarefa.'], 403);
        }

        $tarefa->delete();

        return response()->json(['message' => 'Tarefa excluída com sucesso!'], 200);
    }
}