<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Information;
use App\Models\Role;
use App\Utils\PaginationHelper;
use Illuminate\Http\Request;
use Validator;

class InformationController extends Controller
{
    public function getAll(Request $request) 
    {
        $user = $request->user();

        $page = $request->query('page', PaginationHelper::DEFAULT_PAGE);
        $count = $request->query('count', PaginationHelper::DEFAULT_COUNT);
        $includeInactive = filter_var($request->query('inactive', false), FILTER_VALIDATE_BOOLEAN);

        if (!$user || !$user->role() || $user->role()->name !== Role::ADMIN)
        {
            $includeInactive = false;
        }
        
        $query = Information::query();

        if (!$includeInactive) {
            $query->where('active', '=', true);
        } 

        $informations = $query->paginate($count, ['*'], 'page', $page);

        return response()->json(PaginationHelper::format($informations));
    }

    public function getOne($information_id) 
    {
        $information = Information::find($information_id);
        if(!$information)
            abort(404, 'Information id ' . $information_id . ' not found');

        return $information;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'active' => 'boolean',
        ]);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $information = Information::create([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'category_id' => $request->category_id,
            'active' => $request->has('active') ? $request->active : true,
        ]);

        return response()->json($information, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $information_id)
    {
        $information = Information::find($information_id);

        if (!$information) {
            return response()->json([
                'message' => "Information id {$information_id} not found"
            ], 404);
        }
    
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'active' => 'boolean',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
    
        if ($request->has('title')) {
            $information->title = $request->title;
        }
        if ($request->has('description')) {
            $information->description = $request->description;
        }
        if ($request->has('content')) {
            $information->content = $request->content;
        }
        if ($request->has('category_id')) {
            $information->category_id = $request->category_id;
        }
        if ($request->has('active')) {
            $information->active = $request->active;
        }
    
        $information->save();
    
        return response()->json($information, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $information_id)
    {
        $hard = filter_var($request->query('hard', false), FILTER_VALIDATE_BOOLEAN);

        $information = Information::find($information_id);
    
        if (!$information) {
            return response()->json(['message' => 'Information not found'], 404);
        }
    
        if ($hard) {
            $information->delete();
            return response()->json(['message' => 'Information deleted'], 200);
        } else {
            $information->active = false;
            $information->save();
            return response()->json(['message' => 'Information deactivated'], 200);
        }
    }

    public function toggleFavorite(Request $request)
    {
        $user = $request->user();
        $role = $user->role();

        if(!$role) {
            abort(401, 'Unauthorized');
        }

        $rules = [
            'user_id' => 'nullable|int|exists:users,id',
            'information_id' => 'required|int|exists:informations,id'
        ];

        if($role->name !== Role::ADMIN)
        {
            $rules['user_id'] = ['nullable', function ($attribute, $value, $fail) {
                if (!is_null($value)) {
                    $fail('The ' . $attribute . ' must be null.');
                }
            }];
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user_id = $request->filled('user_id') ? $request->user_id : $user->id;

        $information_id = $request->information_id;

        $doesExist = Favorite::where('user_id', '=', $user_id, 'and')->where('information_id', '=', $information_id)->exists();

        if($doesExist)
            Favorite::where('user_id', '=', $user_id, 'and')->where('information_id', '=', $information_id)->delete();
        else
            Favorite::create([
                'user_id' => $user_id,
                'information_id' => $information_id
            ]);

        return response()->json(['message' => $doesExist ? 'Information removed from favorites' : 'Information added to favorites'], 200);
    }
}
