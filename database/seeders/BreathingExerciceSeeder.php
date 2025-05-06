<?php

namespace Database\Seeders;

use App\Models\BreathingExercice;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BreathingExerciceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if(BreathingExercice::count() == 0)
        {
            BreathingExercice::factory()->count(10)->create();
        }
    }
}
