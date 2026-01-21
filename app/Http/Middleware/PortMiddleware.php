<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PortMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $type = 'web'): Response
    {
        if (app()->environment('testing')) {
            return $next($request);
        }

        $port = $request->getPort();
        $path = $request->getPathInfo();

        if ($port == 8001) {
            // Admin Port (8001)
            if (!str_starts_with($path, '/admin')) {
                if ($path === '/') {
                    return redirect()->route('admin.dashboard');
                }
                
                if ($path === '/login') return redirect()->route('admin.login');
                
                return redirect()->route('admin.dashboard');
            }
        } elseif ($port == 8002) {
            // POS Port (8002)
            if (!str_starts_with($path, '/pos')) {
                if ($path === '/') {
                    return redirect()->route('pos.dashboard');
                }
                
                if ($path === '/login') return redirect()->route('pos.login');
                
                return redirect()->route('pos.dashboard');
            }
        } else {
            // Customer Port (usually 6003)
            // If trying to access admin routes, redirect to port 6001
            if (str_starts_with($path, '/admin')) {
                $url = str_replace(':'.$port, ':8001', $request->fullUrl());
                return redirect($url);
            }
            
            // If trying to access POS routes, redirect to port 6002
            if (str_starts_with($path, '/pos')) {
                $url = str_replace(':'.$port, ':8002', $request->fullUrl());
                return redirect($url);
            }
        }

        return $next($request);
    }
}
