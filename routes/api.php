<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExerciceController;
use App\Http\Controllers\Api\InformationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\ApiSanctumAuth;
use App\Http\Middleware\CheckPermission;
use App\Models\Role;
use App\Models\RolePermission;
use Illuminate\Support\Facades\Route;


Route::post('/users', [UserController::class, 'store']);
Route::post('/users/authenticate', [UserController::class, 'login']); 

Route::get('/users/{user_id}', [UserController::class, 'getOne'])->where('user_id', '[0-9]+');
Route::get('/informations/{information_id}', [InformationController::class, 'getOne'])->where('information_id', '[0-9]+');
Route::get('/categories', [CategoryController::class, 'getAll']);
Route::get('/categories/{category_id}', [CategoryController::class, 'getOne'])->where('category_id', '[0-9]+');
Route::get('/exercices/{exercice_id}', [ExerciceController::class, 'getOne'])->where('exercice_id', '[0-9]+');

Route::middleware([
    ApiSanctumAuth::class,
])->group(function() {
    Route::get('/informations', [InformationController::class, 'getAll']);
    Route::get('/exercices', [ExerciceController::class, 'getAll']);
});

Route::middleware([
    ApiSanctumAuth::class . ':required',
    CheckPermission::class
])->group(function () {
    Route::get('/users/{user_id}/informations/favorites', [UserController::class, 'favorites'])->where('user_id', '[0-9]+'); 
    Route::get('/users/{user_id}/exercices', [UserController::class, 'exercices'])->where('user_id', '[0-9]+'); 
    Route::get('/users/{user_id}/exercices/favorites', [UserController::class, 'favoriteExercices'])->where('user_id', '[0-9]+'); 

    Route::post('/users/is-token-valid', [UserController::class, 'isTokenValid']);
    Route::post('/users/logout', [UserController::class, 'logout']);
    Route::put('/users/{user_id}', [UserController::class, 'update'])->where('user_id', '[0-9]+'); 
    Route::delete('/users/{user_id}', [UserController::class, 'destroy'])->where('user_id', '[0-9]+'); 

    Route::post('/informations/favorites', [InformationController::class, 'toggleFavorite']);

    Route::post('/exercices', [ExerciceController::class, 'store']);
    Route::post('/exercices/favorites', [ExerciceController::class, 'toggleFavorite']);
    Route::put('/exercices/{exercice_id}', [ExerciceController::class, 'update'])->where('exercice_id', '[0-9]+');
    Route::delete('/exercices/{exercice_id}', [ExerciceController::class, 'destroy'])->where('exercice_id', '[0-9]+');
});

Route::middleware([
    ApiSanctumAuth::class . ':required',
    CheckPermission::class . ':role=' . Role::ADMIN
])->group(function () {
    Route::get('/users', [UserController::class, 'getAll']); 
    Route::get('/users/roles', [UserController::class, 'roles']); 

    Route::post('/informations', [InformationController::class, 'store']);
    Route::put('/informations/{information_id}', [InformationController::class, 'update'])->where('information_id', '[0-9]+');
    Route::delete('/informations/{information_id}', [InformationController::class, 'destroy'])->where('information_id', '[0-9]+');

    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category_id}', [CategoryController::class, 'update'])->where('category_id', '[0-9]+');
    Route::delete('/categories/{category_id}', [CategoryController::class, 'destroy'])->where('category_id', '[0-9]+');
});

Route::middleware(['auth:sanctum'])->get('/me', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
        'role' => $request->user()->role()?->name
    ]);
});