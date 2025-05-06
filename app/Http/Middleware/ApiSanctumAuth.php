<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ApiSanctumAuth
{
    public function handle(Request $request, Closure $next, $mode = 'optional'): Response
    {
        $guard = app(\Illuminate\Contracts\Auth\Factory::class);
        $user = $guard->guard('sanctum')->user();

        if ($user) {
            Auth::setUser($user);
        }

        if ($mode === 'required' && !$user) {
            abort(401, 'Unauthenticated.');
        }

        return $next($request);
    }
}
