<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Information;
use Illuminate\Database\Eloquent\Factories\Factory;

class InformationFactory extends Factory
{
    protected $model = Information::class;

    public function definition(): array
    {
        $category = Category::inRandomOrder()->first();

        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph,
            'content' => $this->faker->optional()->text(500),
            'category_id' => $this->faker->boolean(70) && $category ? $category->id : null, // 70% chance of being linked
            'active' => $this->faker->boolean(90),
        ];
    }
}
