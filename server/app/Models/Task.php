<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tarefas';

    // Ajustando os timestamps para o padrão que você colocou no DER
    const CREATED_AT = 'criada_em';
    const UPDATED_AT = 'atualizada_em';

    protected $fillable = [
        'id_evento',
        'atribuída_a',
        'titulo',
        'texto_sentimento',
        'status',
        'priority',
    ];

    // Relacionamento: A tarefa pertence a um Evento
    public function evento()
    {
        return $this->belongsTo(Event::class, 'id_evento');
    }

    // Relacionamento: A tarefa está atribuída a um Usuário
    public function responsavel()
    {
        return $this->belongsTo(User::class, 'atribuída_a');
    }
}