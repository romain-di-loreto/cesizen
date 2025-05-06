<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    protected $table = 'favorites';
    public $incrementing = false;
    protected $primaryKey = ['user_id', 'information_id'];
    protected $fillable = ['user_id', 'information_id'];
}
