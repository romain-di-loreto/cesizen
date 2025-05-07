<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, ...$args): Response
    {
        $user = $request->user();

        $requiredRole = null;
        $permissions = [];

        foreach ($args as $arg) {
            if (str_starts_with($arg, 'role=')) {
                $requiredRole = substr($arg, strlen('role='));
            } else {
                $permissions[] = $arg;
            }
        }

        $role = $user ? $user->role() : null;

        if ($requiredRole == 'None' && count($permissions) != 0 || $requiredRole != 'None' && (!$user || !$role)) {
            abort(403, 'Unauthorized: No role assigned.');
        }
        
        if ($requiredRole && $requiredRole != 'None' && $role->name !== $requiredRole) {
            abort(403, 'Unauthorized: Incorrect role.');
        }

        if ($requiredRole != 'None' && !empty($permissions) && !$role->can(...$permissions)) {
            abort(403, 'Unauthorized: Missing required permissions.');
        }

        return $next($request);
    }
}