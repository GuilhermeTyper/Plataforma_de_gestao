<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('usuarios', function (Blueprint $table) {
        $table->uuid('id')->primary(); // UUID conforme seu DER
        $table->string('nome');
        $table->string('email')->unique();
        $table->string('senha');
        $table->date('nascimento')->nullable();
        $table->timestamps();
    });

    DB::statement("ALTER TABLE usuarios ADD CONSTRAINT chk_nascimento CHECK (nascimento <= CURRENT_DATE - INTERVAL '\18 YEAR\')");
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
