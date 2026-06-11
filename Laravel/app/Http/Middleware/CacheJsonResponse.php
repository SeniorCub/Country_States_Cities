<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->method() !== 'GET') {
            return $next($request);
        }

        // Generate a unique cache key based on URL and query parameters
        $key = 'api_response_' . md5($request->fullUrl());

        if (Cache::has($key)) {
            return response(Cache::get($key))->header('Content-Type', 'application/json')->header('X-Cache', 'HIT');
        }

        $response = $next($request);

        if ($response->isSuccessful()) {
            // Cache successful responses for 1 hour (3600 seconds)
            Cache::put($key, $response->getContent(), 3600);
            $response->header('X-Cache', 'MISS');
        }

        return $response;
    }
}
