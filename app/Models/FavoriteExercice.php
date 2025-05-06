<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavoriteExercice extends Model
{
    protected $table = 'favorite_exercices';
    public $incrementing = false;
    protected $primaryKey = ['user_id', 'exercice_id'];
    protected $fillable = ['user_id', 'exercice_id'];
}
