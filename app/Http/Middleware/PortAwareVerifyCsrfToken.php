<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Symfony\Component\HttpFoundation\Cookie;

class PortAwareVerifyCsrfToken extends Middleware
{
    /**
     * Add the CSRF token to the response cookies.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Symfony\Component\HttpFoundation\Response  $response
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function addCookieToResponse($request, $response)
    {
        $config = config('session');

        if ($response instanceof \Illuminate\Http\Response ||
            $response instanceof \Illuminate\Http\JsonResponse) {
            
            $port = $request->server('SERVER_PORT') ?? '8000';
            $cookieName = 'XSRF-TOKEN-' . $port;

            $response->headers->setCookie(
                new Cookie(
                    $cookieName, $request->session()->token(), $this->availableAt(60 * $config['lifetime']),
                    $config['path'], $config['domain'], $config['secure'], false, false, $config['same_site'] ?? null
                )
            );
        }

        return $response;
    }
}
