<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index(Request $request)
    {
        $query = Country::query();
        
        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['states', 'cities', 'regionModel', 'subregionModel'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }

        if ($request->has('per_page')) {
            $perPage = min($request->get('per_page', 15), 100);
            $countries = $query->paginate($perPage);
        } else {
            $countries = $query->get();
        }
        
        return response()->json($countries);
    }

    public function show(Request $request, $id)
    {
        $query = Country::query();

        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['states', 'cities', 'regionModel', 'subregionModel'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }

        $country = $query->find($id);
        
        if (!$country) {
            return response()->json(['error' => 'Country not found'], 404);
        }
        
        return response()->json($country);
    }

    public function states(Request $request, $id)
    {
        $country = Country::find($id);
        
        if (!$country) {
            return response()->json(['error' => 'Country not found'], 404);
        }
        
        $query = $country->states();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        $states = $query->get();
        return response()->json($states);
    }

    public function cities(Request $request, $id)
    {
        $country = Country::find($id);
        
        if (!$country) {
            return response()->json(['error' => 'Country not found'], 404);
        }
        
        $query = $country->cities();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        $cities = $query->get();
        return response()->json($cities);
    }

    public function search(Request $request)
    {
        $query = Country::query();

        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['states', 'cities', 'regionModel', 'subregionModel'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }
        
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        if ($request->has('iso2')) {
            $query->where('iso2', strtoupper($request->iso2));
        }
        
        if ($request->has('iso3')) {
            $query->where('iso3', strtoupper($request->iso3));
        }
        
        if ($request->has('region')) {
            $query->where('region', 'like', '%' . $request->region . '%');
        }
        
        if ($request->has('subregion')) {
            $query->where('subregion', 'like', '%' . $request->subregion . '%');
        }

        if ($request->has('per_page')) {
            $perPage = min($request->get('per_page', 15), 100);
            return response()->json($query->paginate($perPage));
        }
        
        $countries = $query->get();
        return response()->json($countries);
    }

    public function byCode($code)
    {
        $code = strtoupper($code);
        $country = Country::where('iso2', $code)
                         ->orWhere('iso3', $code)
                         ->first();
        
        if (!$country) {
            return response()->json(['error' => 'Country not found'], 404);
        }
        
        return response()->json($country);
    }
}
