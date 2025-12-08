<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subregion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'region_id', 'translations', 'wikiDataId'
    ];

    protected $casts = [
        'translations' => 'array',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function countries()
    {
        return $this->hasMany(Country::class);
    }
}
