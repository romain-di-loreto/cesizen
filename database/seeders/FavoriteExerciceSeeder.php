<?php

namespace Database\Seeders;

use App\Models\FavoriteExercice;
use App\Models\User;
use App\Models\BreathingExercice;
use Illuminate\Database\Seeder;

class FavoriteExerciceSeeder extends Seeder
{
    public function run(): void
    {
        if(FavoriteExercice::count() == 0)
        {
            // Get all the users and breathing exercices
            $users = User::whereNotNull('role_id')->get();
            $exercices = BreathingExercice::all();

            // Make sure we have both users and exercices
            if ($users->isEmpty() || $exercices->isEmpty()) {
                echo "No users or breathing exercices found. Please make sure they are seeded first.";
                return;
            }

            // Create a set number of favorite exercices for each user
            foreach ($users as $user) {
                // Pick a random number of exercices to be marked as favorite for each user
                $randomExercices = $exercices->random(rand(1, 5)); // Randomly choose 1 to 5 exercices for each user

                foreach ($randomExercices as $exercice) {
                    FavoriteExercice::create([
                        'user_id' => $user->id,
                        'exercice_id' => $exercice->id,
                    ]);
                }
            }
        }
    }
}