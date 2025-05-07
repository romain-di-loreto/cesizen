<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Information;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/informations/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/informations/new');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
    }

    /**
     * Display the specified resource.
     */
    public function show($information_id)
    {
        $information = Information::find($information_id);

        if (!$information) {
            abort(404, "Information not found.");
        }
        
        $categories = Category::all(); 

        return Inertia::render('admin/informations/show', [
            'information' => $information,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($information_id)
    {
        $information = Information::find($information_id);

        if (!$information) {
            abort(404, "Information not found.");
        }
        
        $categories = Category::all(); 

        return Inertia::render('admin/informations/edit', [
            'information' => $information,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Information $information)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Information $information)
    {
        //
    }
}
