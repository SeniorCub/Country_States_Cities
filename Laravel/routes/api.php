<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\StateController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\SubregionController;
use App\Http\Controllers\Api\StatsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Region routes
Route::get('/regions', [RegionController::class, 'index']);
Route::get('/regions/{id}', [RegionController::class, 'show']);
Route::get('/regions/{id}/subregions', [RegionController::class, 'subregions']);
Route::get('/regions/{id}/countries', [RegionController::class, 'countries']);

// Subregion routes
Route::get('/subregions', [SubregionController::class, 'index']);
Route::get('/subregions/{id}', [SubregionController::class, 'show']);
Route::get('/subregions/{id}/countries', [SubregionController::class, 'countries']);

// Statistics
Route::get('/stats', [StatsController::class, 'index']);

// Search routes (alternative format)
Route::get('/search/countries', [CountryController::class, 'search']);
Route::get('/search/states', [StateController::class, 'search']);
Route::get('/search/cities', [CityController::class, 'search']);

// Country routes
Route::get('/countries', [CountryController::class, 'index']);
Route::get('/countries/search', [CountryController::class, 'search']);
Route::get('/countries/code/{code}', [CountryController::class, 'byCode']);
Route::get('/countries/{id}', [CountryController::class, 'show']);
Route::get('/countries/{id}/states', [CountryController::class, 'states']);
Route::get('/countries/{id}/cities', [CountryController::class, 'cities']);

// State routes
Route::get('/states', [StateController::class, 'index']);
Route::get('/states/search', [StateController::class, 'search']);
Route::get('/states/{id}', [StateController::class, 'show']);
Route::get('/states/{id}/cities', [StateController::class, 'cities']);
Route::get('/states/{id}/country', [StateController::class, 'country']);

// City routes
Route::get('/cities', [CityController::class, 'index']);
Route::get('/cities/search', [CityController::class, 'search']);
Route::get('/cities/nearby', [CityController::class, 'nearby']);
Route::get('/cities/{id}', [CityController::class, 'show']);
Route::get('/cities/{id}/state', [CityController::class, 'state']);
Route::get('/cities/{id}/country', [CityController::class, 'country']);
