<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BreathingExercice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExerciceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/exercices/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/exercices/new');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($exercice_id)
    {
        $exercice = BreathingExercice::find($exercice_id);

        if (!$exercice) {
            abort(404, "Information not found.");
        }

        return Inertia::render('admin/exercices/show', [
            'exercice' => $exercice,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($exercice_id)
    {
        $exercice = BreathingExercice::find($exercice_id);

        if (!$exercice) {
            abort(404, "Information not found.");
        }

        return Inertia::render('admin/exercices/edit', [
            'exercice' => $exercice,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BreathingExercice $breathingExercice)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BreathingExercice $breathingExercice)
    {
        //
    }
}
