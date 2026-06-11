<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index(Request $request)
    {
        $query = State::query();
        
        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['country', 'cities'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }

        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        if ($request->has('per_page')) {
            $perPage = min($request->get('per_page', 15), 100);
            $states = $query->paginate($perPage);
        } else {
            $states = $query->get();
        }
        
        return response()->json($states);
    }

    public function show(Request $request, $id)
    {
        $query = State::query();

        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['country', 'cities'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }

        $state = $query->find($id);
        
        if (!$state) {
            return response()->json(['error' => 'State not found'], 404);
        }
        
        return response()->json($state);
    }

    public function cities(Request $request, $id)
    {
        $state = State::find($id);
        
        if (!$state) {
            return response()->json(['error' => 'State not found'], 404);
        }
        
        $query = $state->cities();

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        $cities = $query->get();
        return response()->json($cities);
    }

    public function search(Request $request)
    {
        $query = State::query();

        if ($request->has('include')) {
            $includes = explode(',', $request->include);
            $allowedIncludes = ['country', 'cities'];
            $query->with(array_intersect($includes, $allowedIncludes));
        }
        
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        if ($request->has('country_id')) {
            $query->where('country_id', $request->country_id);
        }
        
        if ($request->has('country_code')) {
            $query->where('country_code', strtoupper($request->country_code));
        }
        
        if ($request->has('iso2')) {
            $query->where('iso2', strtoupper($request->iso2));
        }

        if ($request->has('per_page')) {
            $perPage = min($request->get('per_page', 15), 100);
            return response()->json($query->paginate($perPage));
        }
        
        $states = $query->get();
        return response()->json($states);
    }

    public function country($id)
    {
        $state = State::with('country')->find($id);
        
        if (!$state) {
            return response()->json(['error' => 'State not found'], 404);
        }
        
        return response()->json($state->country);
    }
}
