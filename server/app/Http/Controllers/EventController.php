<?php

namespace App\Http\Controllers;

use App\Models\Event; // Ou 'Evento' conforme o nome do seu Model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Listar todos os eventos vinculados ao usuário logado.
     */
    public function index()
    {
        $userId = Auth::guard('api')->id();

        // Busca eventos onde o usuário é o dono OU onde ele participa na tabela pivô
        $eventos = Event::where('owner_id', $userId)
            ->orWhereHas('colaboradores', function ($query) use ($userId) {
                $query->where('id_usuario', $userId);
            })->get();

        return response()->json($eventos, 200);
    }

    /**
     * Criar um novo evento.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after_or_equal:data_inicio',
        ]);

        // Vincula o owner_id automaticamente pelo token JWT
        $evento = Event::create([
            'owner_id' => Auth::guard('api')->id(),
            'titulo' => $request->titulo,
            'descricao' => $request->descricao,
            'data_inicio' => $request->data_inicio,
            'data_fim' => $request->data_fim,
        ]);

        return response()->json([
            'message' => 'Evento criado com sucesso!',
            'evento' => $evento
        ], 201);
    }

    /**
     * Exibir os detalhes de um evento específico (com tarefas e colaboradores).
     */
    public function show(string $id)
    {
        $userId = Auth::guard('api')->id();
        
        // Eager Loading: Traz o evento com o array de tarefas e colaboradores aninhados
        $evento = Event::with(['tarefas', 'colaboradores'])->findOrFail($id);

        $ehColaborador = $evento->colaboradores()->where('id_usuario', $userId)->exists();
        
        // Segurança: Bloqueia se quem está chamando não for o dono nem colaborador
        if ($evento->owner_id !== $userId && !$ehColaborador) {
            return response()->json(['message' => 'Você não tem permissão para acessar este evento.'], 403);
        }

        return response()->json($evento, 200);
    }

    /**
     * Atualizar dados estruturais do evento.
     */
    public function update(Request $request, string $id)
    {
        $evento = Event::findOrFail($id);
        $userId = Auth::guard('api')->id();

        // Apenas o dono ou um colaborador "editor" pode alterar o evento em si
        $funcao = $evento->colaboradores()->where('id_usuario', $userId)->value('funcao');

        if ($evento->owner_id !== $userId && $funcao !== 'editor') {
            return response()->json(['message' => 'Você não tem permissão para editar este evento.'], 403);
        }

        $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'descricao' => 'nullable|string',
            'data_inicio' => 'sometimes|date',
            'data_fim' => 'sometimes|date|after_or_equal:data_inicio',
        ]);

        $evento->update($request->all());

        return response()->json([
            'message' => 'Evento atualizado com sucesso!',
            'evento' => $evento
        ], 200);
    }

    /**
     * Excluir um evento.
     */
    public function destroy(string $id)
    {
        $evento = Event::findOrFail($id);

        // Regra estrita: Só o dono do evento (owner_id) pode deletar o evento inteiro
        if ($evento->owner_id !== Auth::guard('api')->id()) {
            return response()->json(['message' => 'Apenas o criador do evento pode excluí-lo.'], 403);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento excluído com sucesso!'], 200);
    }
}