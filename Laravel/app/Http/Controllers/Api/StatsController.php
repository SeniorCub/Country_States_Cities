<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\Region;
use App\Models\Subregion;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index()
    {
        $stats = [
            'countries' => Country::count(),
            'states' => State::count(),
            'cities' => City::count(),
            'regions' => Region::count(),
            'subregions' => Subregion::count(),
        ];
        
        return response()->json($stats);
    }
}
