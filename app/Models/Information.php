<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Information extends Model
{
    /** @use HasFactory<\Database\Factories\InformationFactory> */
    use HasFactory;

    protected $table = 'informations';

    protected $fillable = [
        'title',
        'description',
        'content',
        'category_id',
        'active'
    ];

    public function category()
    {
        return $this->hasOne(Category::class);
    }

    public function getCategory(): string
    {
        $category = $this->category()->first();

        if(!$category)
            return 'other';
        else
            return $category->name;
    }
}
