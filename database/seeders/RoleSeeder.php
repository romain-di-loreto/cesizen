<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Role::count() === 0) {
            $admin = Role::create(['name' => Role::ADMIN]);
            $adminPermission = [
                RolePermission::UPDATE_SELF, RolePermission::DELETE_SELF,
                RolePermission::UPDATE_USER, RolePermission::DEACTIVATE_USER, RolePermission::DELETE_USER,
                RolePermission::CREATE_INFORMATION, RolePermission::UPDATE_INFORMATION, RolePermission::DEACTIVATE_INFORMATION, RolePermission::DELETE_INFORMATION,
                RolePermission::CREATE_CATEGORY, RolePermission::UPDATE_CATEGORY, RolePermission::DELETE_CATEGORY,
                RolePermission::CREATE_EXERCICE, RolePermission::UPDATE_OWN_EXERCICE, RolePermission::DELETE_OWN_EXERCICE,
                RolePermission::UPDATE_EXERCICE, RolePermission::DEACTIVATE_EXERCICE, RolePermission::DELETE_EXERCICE
                
            ];
            $admin->addPermissions(...$adminPermission);
            
            $user = Role::create(['name' => Role::USER]);
            $userPermission = [
                RolePermission::UPDATE_SELF, RolePermission::DELETE_SELF,
                RolePermission::CREATE_EXERCICE, RolePermission::UPDATE_OWN_EXERCICE, RolePermission::DELETE_OWN_EXERCICE,
            ];
            $user->addPermissions(...$userPermission);
        }
    }
}
