<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasUuids;

    protected $table = 'usuarios'; // Alinhando com o seu DER

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'nascimento', // 🔥 ADICIONADO: Necessário para o cadastro funcionar com a coluna nova
    ];

    protected $hidden = [
        'senha',
    ];

    // 🔥 ADICIONADO: Diz ao Laravel para usar a coluna 'senha' na autenticação interna
    public function getAuthPassword()
    {
        return $this->senha;
    }

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

    // Identificador único do JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}