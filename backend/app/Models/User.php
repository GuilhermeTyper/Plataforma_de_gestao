<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // Se for usar o JWT-Auth depois

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasUuids; // HasUuids faz o Laravel gerar o UUID sozinho!

    protected $table = 'usuarios'; // Alinhando com o seu DER

    protected $fillable = [
        'nome',
        'email',
        'senha',
    ];

    protected $hidden = [
        'senha',
    ];

    // Relacionamento: Um usuário é proprietário de Muitos Eventos
    public function eventosProprios()
    {
        return $this->hasMany(Event::class, 'owner_id');
    }

    // Relacionamento N:M - Eventos em que o usuário colabora
    public function eventosColaborados()
    {
        return $this->belongsToMany(Event::class, 'usuario_evento', 'id_usuario', 'event_id')
                    ->withPivot('funcao');
    }

    // Relacionamento: Tarefas atribuídas a este usuário
    public function tarefas()
    {
        return $this->hasMany(Task::class, 'atribuída_a');
    }

    // Métodos obrigatórios do JWT (pode deixar pronto)
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}