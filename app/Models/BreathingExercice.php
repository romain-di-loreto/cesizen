<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BreathingExercice extends Model
{
    /** @use HasFactory<\Database\Factories\InformationFactory> */
    use HasFactory;

    protected $table = 'breathing_exercices';

    protected $fillable = [
        'inhale_time',
        'exhale_time',
        'hold_time',
        'repetitions',
        'active',
        'public'
    ];
}
