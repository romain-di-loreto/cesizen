<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    const ADMIN = 'Admin';
    const USER = 'User';

    protected $fillable = ['name', 'active'];

    public function permissions()
    {
        return $this->hasMany(RolePermission::class, 'role_id', 'id');
    }

    public function getPermissions()
    {
        return $this->permissions()->get();
    }

    public function hasAtLeastPermissionsOfRoleid($roleId)
    {
        $role = Role::find($roleId);

        if(!$role)
            return true;
    
        $thisPermissions = $this->permissions()->pluck('name')->toArray();
        $otherPermissions = $role->permissions()->pluck('name')->toArray(); 
        
        return empty(array_diff($otherPermissions, $thisPermissions));
    }

    public function can(...$permissions) 
    {
        $count = $this->permissions()
        ->whereIn('name', $permissions)
        ->count();

        return $count == count($permissions);
    }

    public function addPermissions(...$permissions)
    {
        foreach ($permissions as $permission)
        {
            if(!$this->can($permission))
            {
                RolePermission::create([
                    'name' => $permission,
                    'role_id' => $this->id
                ]);
            }
        }
    }

    public function removePermissions(...$permissions)
    {
        $perms = $this->permissions()->whereIn('name', $permissions)->get();

        foreach ($perms as $permission)
        {
            $permission->delete();
        }
    }
}
