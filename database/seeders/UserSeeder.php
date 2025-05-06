<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if(User::count() === 0)
        {
            $dummy = User::create([
                'name' => 'Dummy',
                'email' => 'dummy@dummy.fr',
                'password' => bcrypt('123456789'),
                'role_id' => null
            ]);

            $admin = User::create([
                'name' => 'Admin',
                'email' => 'admin@admin.fr',
                'password' => bcrypt('123456789'),
                'role_id' => 1
            ]);

            $user = User::create([
                'name' => 'user',
                'email' => 'user@user.fr',
                'password' => bcrypt('123456789'),
                'role_id' => 2
            ]);
        }
    }
}
