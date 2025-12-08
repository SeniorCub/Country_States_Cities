<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'iso3', 'iso2', 'numeric_code', 'phone_code', 
        'capital', 'currency', 'currency_name', 'currency_symbol',
        'tld', 'native', 'region', 'subregion', 'timezones',
        'translations', 'latitude', 'longitude', 'emoji', 'emojiU',
        'region_id', 'subregion_id'
    ];

    protected $casts = [
        'translations' => 'array',
        'timezones' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function regionModel()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }

    public function subregionModel()
    {
        return $this->belongsTo(Subregion::class, 'subregion_id');
    }

    public function states()
    {
        return $this->hasMany(State::class);
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }
}
