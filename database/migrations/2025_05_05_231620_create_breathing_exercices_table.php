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
        Schema::create('breathing_exercices', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->integer('inhale_time');
                $table->integer('exhale_time');
                $table->integer('hold_time')->default(0);
                $table->integer('repetitions')->default(1);
                $table->boolean('active')->default(true);
                $table->boolean('public')->default(false);
                $table->bigInteger('author_id');
                $table->timestamps();

                $table->foreign('author_id')->references('id')
                ->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('breathing_exercices');
    }
};
