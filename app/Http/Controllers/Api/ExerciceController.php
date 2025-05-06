<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BreathingExercice;
use App\Models\FavoriteExercice;
use App\Models\Role;
use App\Models\RolePermission;
use App\Utils\PaginationHelper;
use Illuminate\Http\Request;
use Validator;

class ExerciceController extends Controller
{
    public function getAll(Request $request) 
    {
        $user = $request->user();

        $page = $request->query('page', PaginationHelper::DEFAULT_PAGE);
        $count = $request->query('count', PaginationHelper::DEFAULT_COUNT);
        $includeInactive = filter_var($request->query('inactive', false), FILTER_VALIDATE_BOOLEAN);
        $includeOnlyPublished = filter_var($request->query('public', true), FILTER_VALIDATE_BOOLEAN);

        if (!$user || !$user->role || $user->role->name !== Role::ADMIN)
        {
            $includeInactive = false;
            $includeOnlyPublished = true;
        }
        
        $query = BreathingExercice::query();

        if (!$includeInactive) {
            $query->where('active', '=', true);
        }        
        if ($includeOnlyPublished) {
            $query->where('public', '=', true);
        }

        $exercices = $query->paginate($count, ['*'], 'page', $page);

        return response()->json(PaginationHelper::format($exercices));
    }

    public function getOne($exercice_id) 
    {
        $exercice = BreathingExercice::find($exercice_id);
        if(!$exercice)
            abort(404, 'Breathing exercice id ' . $exercice_id . ' not found');

        return $exercice;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $role = $user->role;
        
        $rules = [
            'author_id'    => 'nullable|int|exists:users,id',
            'title'        => 'required|string|max:255',
            'inhale_time'  => 'required|integer|min:1',
            'exhale_time'  => 'required|integer|min:1',
            'hold_time'    => 'nullable|integer|min:0',
            'repetitions'  => 'nullable|integer|min:1',
            'public'       => 'nullable|boolean',
            'active'       => 'nullable|boolean'
        ];

        if($role && $role->name !== Role::ADMIN)
        {
            $rules['author_id'] = ['nullable', function ($attribute, $value, $fail) {
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

        $author_id = $request->filled('author_id') ? $request->author_id : $user->id;

        $exercice = BreathingExercice::create([
            'title'        => $request->title,
            'inhale_time'  => $request->inhale_time,
            'exhale_time'  => $request->exhale_time,
            'hold_time'    => $request->hold_time ?? 0,
            'repetitions'  => $request->repetitions ?? 1,
            'public'       => $request->public ?? false,
            'active'       => $request->active ?? true,
            'author_id'    => $author_id
        ]);

        return response()->json($exercice, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $exercice_id)
    {
        $user = $request->user();
        $role = $user->role;

        $exercice = BreathingExercice::find($exercice_id);

        if (!$exercice) {
            return response()->json(['message' => 'Breathing exercice not found'], 404);
        }

        $isOwner = $exercice->author_id === $user->id;

        if ($isOwner && (!$role || !$role->can(RolePermission::UPDATE_OWN_EXERCICE))) {
            return response()->json([
                'message' => 'Operation not permitted',
                'errors' => ['Role' => 'Missing UPDATE_OWN_EXERCICE permission']
            ], 403);
        }

        if (!$isOwner && (!$role || !$role->can(RolePermission::UPDATE_EXERCICE))) {
            return response()->json([
                'message' => 'Operation not permitted',
                'errors' => ['Role' => 'Missing UPDATE_EXERCICE permission']
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|required|string|max:255',
            'inhale_time'  => 'sometimes|required|integer|min:1',
            'exhale_time'  => 'sometimes|required|integer|min:1',
            'hold_time'    => 'sometimes|nullable|integer|min:0',
            'repetitions'  => 'sometimes|nullable|integer|min:1',
            'public'       => 'sometimes|boolean',
            'active'       => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $exercice->fill($validator->validated());
        $exercice->save();

        return response()->json($exercice, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $exercice_id)
    {
        $user = $request->user();
        $role = $user->role;

        $hard = filter_var($request->query('hard', false), FILTER_VALIDATE_BOOLEAN);

        $exercice = BreathingExercice::find($exercice_id);

        if (!$exercice) {
            return response()->json(['message' => 'Breathing exercice not found'], 404);
        }

        $isOwner = $exercice->author_id === $user->id;

        if ($isOwner) {
            if (!$role || !$role->can(RolePermission::DELETE_OWN_EXERCICE)) {
                return response()->json([
                    'message' => 'Operation not permitted',
                    'errors' => ['Role' => 'Missing DELETE_OWN_EXERCICE permission']
                ], 403);
            }

            // Owner with permission can delete directly if hard=false or true
            $exercice->delete();
            return response()->json(['message' => 'Breathing exercice deleted'], 200);
        }

        // Not the owner
        if ($hard) {
            if (!$role || !$role->can(RolePermission::DELETE_EXERCICE)) {
                return response()->json([
                    'message' => 'Operation not permitted',
                    'errors' => ['Role' => 'Missing DELETE_EXERCICE permission']
                ], 403);
            }

            $exercice->delete();
            return response()->json(['message' => 'Breathing exercice deleted'], 200);
        } else {
            if (!$role || !$role->can(RolePermission::DEACTIVATE_EXERCICE)) {
                return response()->json([
                    'message' => 'Operation not permitted',
                    'errors' => ['Role' => 'Missing DEACTIVATE_EXERCICE permission']
                ], 403);
            }

            $exercice->active = false;
            $exercice->save();
            return response()->json(['message' => 'Breathing exercice deactivated'], 200);
        }
    }

    public function toggleFavorite(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        if(!$role) {
            abort(401, 'Unauthorized');
        }

        $rules = [
            'user_id' => 'nullable|int|exists:users,id',
            'exercice_id' => 'required|int|exists:breathing_exercices,id'
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

        $exercice_id = $request->exercice_id;

        $doesExist = FavoriteExercice::where('user_id', '=', $user_id, 'and')->where('information_id', '=', $exercice_id)->exists();

        if($doesExist)
            FavoriteExercice::where('user_id', '=', $user_id, 'and')->where('information_id', '=', $exercice_id)->delete();
        else
            FavoriteExercice::create([
                'user_id' => $user_id,
                'exercice_id' => $exercice_id
            ]);

        return response()->json(['message' => $doesExist ? 'Exercice removed from favorites' : 'Exercice added to favorites'], 200);
    }
}
