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
        Schema::create('tarefas', function (Blueprint $table) {
            $table->id(); // SERIAL (Chave Primária)
            $table->unsignedBigInteger('id_evento'); // FK para a tabela eventos
            $table->uuid('atribuída_a')->nullable(); // FK para o UUID de usuários
            $table->string('titulo');
            $table->text('texto_sentimento')->nullable(); // Campo estratégico do Mood!
            
            // Status como ENUM igual ao seu desenho
            $table->enum('status', ['pendente', 'em_andamento', 'concluído'])->default('pendente');
            
            // Prioridade como SMALLINT
            $table->smallInteger('priority')->default(3);
            
            // Timestamps customizados conforme o DER
            $table->timestamp('criada_em')->useCurrent();
            $table->timestamp('atualizada_em')->useCurrent()->useCurrentOnUpdate();

            // CHAVES ESTRANGEIRAS (Criam as linhas de relação no banco)
            $table->foreign('id_evento')->references('id')->on('eventos')->onDelete('cascade');
            $table->foreign('atribuída_a')->references('id')->on('usuarios')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarefas');
    }
};