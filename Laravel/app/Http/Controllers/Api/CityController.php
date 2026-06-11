<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $query = City::query();
        
        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['state', 'country'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }

        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        if ($request->has('state_id')) {
            $query->where('state_id', $request->state_id);
        }
        
        if ($request->has('per_page')) {
            $perPage = min($request->get('per_page', 15), 100);
            $cities = $query->paginate($perPage);
        } else {
            $cities = $query->get();
        }
        
        return response()->json($cities);
    }

    public function show(Request $request, $id)
    {
        $query = City::query();

        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['state', 'country'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }

        $city = $query->find($id);
        
        if (!$city) {
            return response()->json(['error' => 'City not found'], 404);
        }
        
        return response()->json($city);
    }

    public function search(Request $request)
    {
        $query = City::query();

        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['state', 'country'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }
        
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        if ($request->has('state_id')) {
            $query->where('state_id', $request->state_id);
        }
        
        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        if ($request->has('country_code')) {
            $query->where('country_code', strtoupper($request->country_code));
        }
        
        if ($request->has('state_code')) {
            $query->where('state_code', strtoupper($request->state_code));
        }

        if ($request->has('per_page')) {
            $perPage = min($request->get('per_page', 15), 100);
            return response()->json($query->paginate($perPage));
        }
        
        $cities = $query->get();
        return response()->json($cities);
    }

    public function state($id)
    {
        $city = City::with('state')->find($id);
        
        if (!$city) {
            return response()->json(['error' => 'City not found'], 404);
        }
        
        return response()->json($city->state);
    }

    public function country($id)
    {
        $city = City::with('country')->find($id);
        
        if (!$city) {
            return response()->json(['error' => 'City not found'], 404);
        }
        
        return response()->json($city->country);
    }

    public function nearby(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'nullable|numeric|min:1|max:1000'
        ]);
        
        $latitude = $request->latitude;
        $longitude = $request->longitude;
        $radius = $request->get('radius', 50);
        
        $cities = City::selectRaw("
                *,
                (6371 * acos(cos(radians(?)) 
                * cos(radians(latitude)) 
                * cos(radians(longitude) - radians(?)) 
                + sin(radians(?)) 
                * sin(radians(latitude)))) AS distance
            ", [$latitude, $longitude, $latitude])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->having('distance', '<=', $radius)
            ->orderBy('distance')
            ->limit(50)
            ->get();
        
        return response()->json($cities);
    }
}
