<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('usuario_evento', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('event_id'); // FK para eventos
        $table->uuid('id_usuario'); // FK para usuários
        $table->string('funcao')->default('visualizador'); // 'editor', 'visualizador'

        $table->foreign('event_id')->references('id')->on('eventos')->onDelete('cascade');
        $table->foreign('id_usuario')->references('id')->on('usuarios')->onDelete('cascade');
        $table->unique(['event_id', 'id_usuario']); // Evita duplicidade
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario_evento');
    }
};
