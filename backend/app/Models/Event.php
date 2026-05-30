<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'eventos';

    protected $fillable = [
        'owner_id',
        'titulo',
        'descricao',
        'data_inicio',
        'data_fim',
    ];

    // O Laravel gerencia o criada_em / atualizada_em automaticamente com estes nomes:
    const CREATED_AT = 'created_at'; 
    const UPDATED_AT = 'updated_at';

    // Relacionamento: O evento pertence a um Proprietário (User)
    public function dono()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Relacionamento: Um evento contém muitas Tarefas
    public function tarefas()
    {
        return $this->hasMany(Task::class, 'id_evento');
    }

    // Relacionamento N:M - Usuários que colaboram neste evento
    public function colaboradores()
    {
        return $this->belongsToMany(User::class, 'usuario_evento', 'event_id', 'id_usuario')
                    ->withPivot('funcao');
    }
}