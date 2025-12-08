<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subregion;
use Illuminate\Http\Request;

class SubregionController extends Controller
{
    public function index()
    {
        $subregions = Subregion::orderBy('name')->get();
        return response()->json($subregions);
    }

    public function show($id)
    {
        $subregion = Subregion::find($id);
        
        if (!$subregion) {
            return response()->json(['error' => 'Subregion not found'], 404);
        }
        
        return response()->json($subregion);
    }

    public function countries($id)
    {
        $subregion = Subregion::find($id);
        
        if (!$subregion) {
            return response()->json(['error' => 'Subregion not found'], 404);
        }
        
        $countries = $subregion->countries()->orderBy('name')->get();
        return response()->json($countries);
    }
}
