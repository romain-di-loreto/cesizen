<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ExerciceController;
use App\Http\Controllers\Admin\InformationController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Models\User;
use App\Models\Category;
use App\Models\Information;
use App\Models\BreathingExercice;

Route::middleware(['auth', 'verified', EnsureUserIsAdmin::class])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('admin/home', [
            'counts' => [
                'users' => User::count(),
                'categories' => Category::count(),
                'informations' => Information::count(),
                'exercices' => BreathingExercice::count(),
            ]
        ]);
    })->name('admin.home');

    // Route::get('/admin/users', fn () => Inertia::render('Admin/Users'))->name('admin.users');
    // Route::get('/admin/categories', fn () => Inertia::render('Admin/Categories'))->name('admin.categories');
    // Route::get('/admin/informations', fn () => Inertia::render('Admin/Informations'))->name('admin.informations');
    // Route::get('/admin/exercices', fn () => Inertia::render('Admin/Exercices'))->name('admin.exercices');

    Route::get('/admin/users', [UserController::class, 'index'])->name('admin.users');
    Route::get('/admin/users/new', [UserController::class, 'create'])->name('admin.users.new');
    Route::get('/admin/users/{user_id}/show', [UserController::class, 'show'])->name('admin.users.show');
    Route::get('/admin/users/{user_id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');

    Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories');
    Route::get('/admin/categories/new', [CategoryController::class, 'create'])->name('admin.categories.new');
    Route::get('/admin/categories/{id}/show', [CategoryController::class, 'show'])->name('admin.categories.show');
    Route::get('/admin/categories/{id}/edit', [CategoryController::class, 'edit'])->name('admin.categories.edit');

    Route::get('/admin/informations', [InformationController::class, 'index'])->name('admin.informations');
    Route::get('/admin/informations/new', [InformationController::class, 'create'])->name('admin.informations.new');
    Route::get('/admin/informations/{id}/show', [InformationController::class, 'show'])->name('admin.informations.show');
    Route::get('/admin/informations/{id}/edit', [InformationController::class, 'edit'])->name('admin.informations.edit');

    Route::get('/admin/exercices', [ExerciceController::class, 'index'])->name('admin.exercices');
    Route::get('/admin/exercices/new', [ExerciceController::class, 'create'])->name('admin.exercices.new');
    Route::get('/admin/exercices/{id}/show', [ExerciceController::class, 'show'])->name('admin.exercices.show');
    Route::get('/admin/exercices/{id}/edit', [ExerciceController::class, 'edit'])->name('admin.exercices.edit');
});

Route::middleware(['auth', 'verified'])->get('/', function () {
    return redirect()->route('admin.home');
})->name('home');

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
