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
    Schema::create('eventos', function (Blueprint $table) {
        $table->id(); // SERIAL
        $table->uuid('owner_id'); // Dono do evento (UUID)
        $table->string('titulo');
        $table->text('descricao')->nullable();
        $table->timestamp('data_inicio');
        $table->timestamp('data_fim')->nullable();
        $table->timestamps();

        // Relação com a tabela usuários
        $table->foreign('owner_id')->references('id')->on('usuarios')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
