<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class POSMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('pos.login');
        }

        // Check if user has staff role
        $user = auth()->user();
        $staffRole = $user->staffRole;

        if (!$staffRole) {
            abort(403, 'Access denied. POS access requires staff role.');
        }

        // Store staff role in request for easy access
        $request->merge(['staff_role' => $staffRole->role]);

        return $next($request);
    }
}
