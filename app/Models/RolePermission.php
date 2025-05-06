<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    public $timestamps = false;

    const UPDATE_SELF = 'update_self';
    const DELETE_SELF = 'delete_self';
    const UPDATE_USER = 'update_user';
    const DEACTIVATE_USER = 'deactivate_user';
    const DELETE_USER = 'delete_user';
    const CREATE_INFORMATION = 'create_information';
    const UPDATE_INFORMATION = 'update_information';
    const DEACTIVATE_INFORMATION = 'deactivate_information';
    const DELETE_INFORMATION = 'delete_information';
    const CREATE_CATEGORY = 'create_category';
    const UPDATE_CATEGORY = 'update_category';
    const DELETE_CATEGORY = 'delete_category';
    const CREATE_EXERCICE = 'create_exercice';
    const UPDATE_EXERCICE = 'update_exercice';
    const DEACTIVATE_EXERCICE = 'deactivate_exercice';
    const DELETE_EXERCICE = 'delete_exercice';
    const UPDATE_OWN_EXERCICE = 'update_own_exercice';
    const DELETE_OWN_EXERCICE = 'delete_own_exercice';


    public function role()
    {
        return $this->belongsTo(Role::class, 'id', 'role_id');
    }

    public function getRole()
    {
        return $this->role()->first();
    }
}
