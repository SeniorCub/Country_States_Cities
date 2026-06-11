<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2'
        ]);

        $query = $request->q;
        $limit = $request->get('limit', 10);

        $countries = Country::where('name', 'like', "%{$query}%")
            ->limit($limit)
            ->get();

        $states = State::with('country')
            ->where('name', 'like', "%{$query}%")
            ->limit($limit)
            ->get();

        $cities = City::with(['state', 'country'])
            ->where('name', 'like', "%{$query}%")
            ->limit($limit)
            ->get();

        return response()->json([
            'countries' => $countries,
            'states' => $states,
            'cities' => $cities
        ]);
    }
}
