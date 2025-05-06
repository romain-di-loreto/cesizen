<?php

namespace Database\Factories;

use App\Models\BreathingExercice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BreathingExerciceFactory extends Factory
{
    protected $model = BreathingExercice::class;

    public function definition(): array
    {
        $author = User::whereNotNull('role_id')->inRandomOrder()->first();

        return [
            'title' => $this->faker->words(3, true),
            'inhale_time' => $this->faker->numberBetween(3, 7),
            'exhale_time' => $this->faker->numberBetween(3, 7),
            'hold_time' => $this->faker->numberBetween(0, 5),
            'repetitions' => $this->faker->numberBetween(1, 5),
            'active' => $this->faker->boolean(80),
            'public' => $this->faker->boolean(80), // 80% chance to be public
            'author_id' => $author ? $author->id : null
        ];
    }
}
