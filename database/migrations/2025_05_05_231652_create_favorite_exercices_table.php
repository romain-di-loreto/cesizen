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
        Schema::create('favorite_exercices', function (Blueprint $table) {
            $table->bigInteger('user_id');
            $table->bigInteger('exercice_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')
                ->on('users')->onDelete('cascade');
            $table->foreign('exercice_id')->references('id')
                ->on('breathing_exercices')->onDelete('cascade');

            $table->primary(['user_id', 'exercice_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite_exercices');
    }
};
