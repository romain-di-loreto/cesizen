<?php

namespace Database\Seeders;

use App\Models\Information;
use Illuminate\Database\Seeder;

class InformationSeeder extends Seeder
{
    public function run(): void
    {
        if(Information::count() == 0)
        {
            Information::factory()->count(20)->create();
        }            
    }
}
