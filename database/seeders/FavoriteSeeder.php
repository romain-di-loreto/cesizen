<?php

namespace Database\Seeders;

use App\Models\Favorite;
use App\Models\User;
use App\Models\Information;
use Illuminate\Database\Seeder;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        if(Favorite::count() == 0)
        {

            $users = User::whereNotNull('role_id')->get();
            $informations = Information::all();

            // Create a set number of favorites
            foreach ($users as $user) {
                // Pick a random number of informations to be marked as favorite for each user
                $randomInformations = $informations->random(rand(1, 5)); // Randomly choose 1 to 5 informations for each user

                foreach ($randomInformations as $information) {
                    Favorite::create([
                        'user_id' => $user->id,
                        'information_id' => $information->id,
                    ]);
                }
            }
        }
    }
}
