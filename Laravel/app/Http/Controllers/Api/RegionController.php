<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index()
    {
        $regions = Region::orderBy('name')->get();
        return response()->json($regions);
    }

    public function show($id)
    {
        $region = Region::find($id);
        
        if (!$region) {
            return response()->json(['error' => 'Region not found'], 404);
        }
        
        return response()->json($region);
    }

    public function subregions($id)
    {
        $region = Region::find($id);
        
        if (!$region) {
            return response()->json(['error' => 'Region not found'], 404);
        }
        
        $subregions = $region->subregions()->orderBy('name')->get();
        return response()->json($subregions);
    }

    public function countries($id)
    {
        $region = Region::find($id);
        
        if (!$region) {
            return response()->json(['error' => 'Region not found'], 404);
        }
        
        $countries = $region->countries()->orderBy('name')->get();
        return response()->json($countries);
    }
}
