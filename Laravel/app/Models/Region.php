<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'translations', 'wikiDataId'
    ];

    protected $casts = [
        'translations' => 'array',
    ];

    public function subregions()
    {
        return $this->hasMany(Subregion::class);
    }

    public function countries()
    {
        return $this->hasMany(Country::class);
    }
}
