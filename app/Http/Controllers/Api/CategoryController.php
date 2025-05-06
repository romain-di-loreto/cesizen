<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Utils\PaginationHelper;
use Illuminate\Http\Request;
use Validator;

class CategoryController extends Controller
{
    public function getAll(Request $request) 
    {
        $page = $request->query('page', PaginationHelper::DEFAULT_PAGE);
        $count = $request->query('count', PaginationHelper::DEFAULT_COUNT);
        
        $categories = Category::paginate($count, ['*'], 'page', $page);

        return response()->json(PaginationHelper::format($categories));
    }

    public function getOne($category_id) 
    {
        $category = Category::find($category_id);

        if(!$category)
            abort(404, 'Category' . $category_id . ' not found');

        return $category;
    }
    
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories',
        ]);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create([
            'name' => $request->name
        ]);

        return response()->json($category, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $category_id)
    {
        $category = Category::find($category_id);
        if(!$category)
            abort(404, 'Category' . $category_id . ' not found');

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:categories' . $category->id,
        ]);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        if($request->has('name'))
        {
            $category->name = $request->name;
        }

        $category->save();
        return response()->json($category, 202);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $category_id)
    {
        $category = Category::find($category_id);
        if(!$category)
            abort(404, 'Category' . $category_id . ' not found');

        $category->delete();

        return response()->json($category, 202);
    }
}
