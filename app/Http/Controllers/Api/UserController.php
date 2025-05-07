<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BreathingExercice;
use App\Models\Information;
use App\Models\Resource;
use App\Models\Role;
use App\Models\RolePermission;
use App\Utils\PaginationHelper;
use Auth;
use Illuminate\Http\Request;
use App\Models\User;

use OpenApi\Annotations as OA;
use Validator;

/**
 * @OA\Info(
 *     title="My API",
 *     version="1.0.0",
 *     description="Auto-generated Swagger docs for your Laravel API"
 * ),
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * ),
 * @OA\Parameter(
 *     parameter="PageParam",
 *     name="page",
 *     in="query",
 *     required=false,
 *     description="Page number",
 *     @OA\Schema(type="integer", example=1)
 * ),
 * @OA\Parameter(
 *     parameter="CountParam",
 *     name="count",
 *     in="query",
 *     required=false,
 *     description="Items per page",
 *     @OA\Schema(type="integer", example=10)
 * ),
 * @OA\Parameter(
 *     parameter="InactiveParam",
 *     name="inactive",
 *     in="query",
 *     required=false,
 *     description="Include inactives results",
 *     @OA\Schema(type="boolean", example=false)
 * ),
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="admin"),
 *     @OA\Property(property="email", type="string", example="admin@admin.fr"),
 *     @OA\Property(property="email_verified_at", type="string", nullable=true, example=null),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-04-14T07:53:12.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-04-14T07:53:12.000000Z"),
 *     @OA\Property(property="active", type="boolean", example=true)
 * ),
 * @OA\Schema(
 *     schema="PaginatedUser",
 *     type="object",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="per_page", type="integer", example=10),
 *     @OA\Property(property="total", type="integer", example=1),
 *     @OA\Property(
 *         property="data",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/User")
 *     )
 * )
 */

class UserController extends Controller
{ 

    /**
     * @OA\Get(
     *     path="/api/users",
     *     tags={"Users"},
     *     summary="Get all users",
     *     description="Returns a paginated list of all users. Optionally includes inactive ones.",
     *     @OA\Parameter(ref="#/components/parameters/PageParam"),
     *     @OA\Parameter(ref="#/components/parameters/CountParam"),
     *     @OA\Parameter(ref="#/components/parameters/InactiveParam"),
     *     @OA\Response(
     *         response=200,
     *         description="A paginated list of users",
     *         @OA\JsonContent(ref="#/components/schemas/PaginatedUser")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not found"
     *     )
     * )
     */
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
        
        $query = User::query();

        if (!$includeInactive) {
            $query->where('active', '=', true);
        } 

        $users = $query->paginate($count, ['*'], 'page', $page);

        return response()->json(PaginationHelper::format($users));
    }

    /**
     * @OA\Get(
     *     path="/api/users/{user_id}",
     *     tags={"Users"},
     *     summary="Get a single user",
     *     description="Retrieve a specific user by their ID.",
     *     @OA\Parameter(
     *         name="user_id",
     *         in="path",
     *         required=true,
     *         description="ID of the user to retrieve",
     *         @OA\Schema(
     *             type="integer",
     *             example=1
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User found",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User id 1 not found")
     *         )
     *     )
     * )
     */
    public function getOne($user_id) 
    {
        $user = User::find($user_id);

        if(!$user)
            abort(404, 'User' . $user_id . ' not found');

        return $user;
    }

    /**
     * @OA\Get(
     *     path="/api/users/{user_id}/favorites",
     *     tags={"Resources"},
     *     summary="Get 'Favorites' resources for a user",
     *     description="Returns paginated resources marked as 'favorites' by the user. Optionally includes inactive resources.",
     *     @OA\Parameter(
     *         name="user_id",
     *         in="path",
     *         required=true,
     *         description="User ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(ref="#/components/parameters/PageParam"),
     *     @OA\Parameter(ref="#/components/parameters/CountParam"),
     *     @OA\Parameter(ref="#/components/parameters/InactiveParam"),
     *     @OA\Response(
     *         response=200,
     *         description="List of favorite resources",
     *         @OA\JsonContent(ref="#/components/schemas/PaginatedUser")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User id 1 not found")
     *         )
     *     )
     * )
     */
    public function favorites(Request $request, $user_id)
    {
        $page = $request->query('page', PaginationHelper::DEFAULT_PAGE);
        $count = $request->query('count', PaginationHelper::DEFAULT_COUNT);
        $includeInactive = filter_var($request->query('inactive', false), FILTER_VALIDATE_BOOLEAN);

        $userAuthed = $request->user();
        if($userAuthed)
            abort(406, 'truc');

        $role = $userAuthed->role;
        if($user_id != $userAuthed->id && !$role || $role->name != Role::ADMIN) {
            abort(401, 'Unauthorized');
        }

        $user = User::find($user_id);

        if(!$user)
            abort(404, 'User' . $user_id . ' not found');

        $informations = Information::whereIn('id', function ($query) use ($user, $includeInactive) {
            $query->select('information_id')
                  ->from('favorites');
            if($includeInactive)
                $query->where('user_id', '=', $user->id, 'and')
                      ->where('active', '=', true);
            else
                $query->where('user_id', '=', $user->id);
            
        })->paginate($count, ['*'], 'page', $page);

        return response()->json(PaginationHelper::format($informations));
    }

    public function favoriteExercices(Request $request, $user_id)
    {
        $page = $request->query('page', PaginationHelper::DEFAULT_PAGE);
        $count = $request->query('count', PaginationHelper::DEFAULT_COUNT);
        $includeInactive = filter_var($request->query('inactive', false), FILTER_VALIDATE_BOOLEAN);

        $userAuthed = $request->user();

        $role = $userAuthed->role;
        if($user_id != $userAuthed->id && !$role || $role->name != Role::ADMIN) {
            abort(401, 'Unauthorized');
        }      

        $user = User::find($user_id);

        if(!$user)
            abort(404, 'User' . $user_id . ' not found');

        $exercices = BreathingExercice::whereIn('id', function ($query) use ($user, $includeInactive) {
            $query->select('exercice_id')
                  ->from('favorite_exercices');
            if($includeInactive)
                $query->where('user_id', '=', $user->id, 'and')
                      ->where('active', '=', true);
            else
                $query->where('user_id', '=', $user->id);
            
        })->paginate($count, ['*'], 'page', $page);

        return response()->json(PaginationHelper::format($exercices));
    }

    public function exercices(Request $request, $user_id)
    {
        $page = $request->query('page', PaginationHelper::DEFAULT_PAGE);
        $count = $request->query('count', PaginationHelper::DEFAULT_COUNT);
        $includeInactive = filter_var($request->query('inactive', false), FILTER_VALIDATE_BOOLEAN);

        $userAuthed = $request->user();

        $role = $userAuthed->role;
        if($user_id != $userAuthed->id && !$role || $role->name != Role::ADMIN) {
            abort(401, 'Unauthorized');
        }      

        $user = User::find($user_id);
        if(!$user)
            abort(404, 'User' . $user_id . ' not found');

        $exercices = null;
        if($includeInactive)
            $exercices = BreathingExercice::where('author_id', '=', $user_id)->paginate($count, ['*'], 'page', $page);
        else
            $exercices = User::where('author_id', '=', $user_id, 'and')->where('active', '=', true)
                ->paginate($count, ['*'], 'page', $page);

        return response()->json(PaginationHelper::format($exercices));
    }
    
    /**
     * @OA\Post(
     *     path="/api/users/authenticate",
     *     tags={"Users"},
     *     summary="Authenticate a user",
     *     description="Authenticates a user and returns an access token along with user data.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 type="object",
     *                 required={"email", "password"},
     *                 @OA\Property(property="email", type="string", format="email", example="aaa@aaa.com"),
     *                 @OA\Property(property="password", type="string", example="123456789")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Authentication successful",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="access_token", type="string", example="7|ZtSnb7IJXXIOSdYURccD0KTGOtDbBct6yqvihDm112b4d82d"),
     *             @OA\Property(property="token_type", type="string", example="Bearer"),
     *             @OA\Property(
     *                 property="user",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=4),
     *                 @OA\Property(property="name", type="string", example="aaa"),
     *                 @OA\Property(property="email", type="string", format="email", example="aaa@aaa.com"),
     *                 @OA\Property(property="email_verified_at", type="string", format="date-time", nullable=true, example=null),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2025-04-15T10:41:22.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2025-04-15T10:41:22.000000Z"),
     *                 @OA\Property(property="active", type="boolean", example=true)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized - Invalid credentials",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Invalid credentials")
     *         )
     *     ), 
     *     @OA\Response(
     *         response=422,
     *         description="Validation failed",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ) 
     * )
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
    
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }
    
        $user = User::where('email', $request->email)->where('active', '=', true)->first();
        // $user->tokens()->delete();
        $token = $user->createToken('api-token')->plainTextToken;
        
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
    
    /**
     * @OA\Post(
     *     path="/api/users/logout",
     *     tags={"Users"},
     *     summary="Logout user",
     *     description="Logs out the currently authenticated user by deleting their current access token.",
     *     security={{ "bearerAuth": {} }},
     *     @OA\Response(
     *         response=200,
     *         description="Logout successful",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Logged out")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Could not logout - Invalid or missing authentication",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Could not logout"),
     *             @OA\Property(
     *                 property="errors",
     *                 type="object",
     *                 @OA\Property(property="Authentication", type="string", example="Invalid Auth Header")
     *             )
     *         )
     *     )
     * )
     */
    public function logout(Request $request)
    {
        $user = $request->user();        
        $user->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     tags={"Users"},
     *     summary="Create a new user",
     *     description="Creates a new user in the system after validating the input data.",
     *     @OA\RequestBody(
     *         required=true,
     *          @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="name", type="string", example="ccc"),
     *                 @OA\Property(property="email", type="string", format="email", example="ccc@ccc.com"),
     *                 @OA\Property(property="password", type="string", example="123456789"),
     *                 @OA\Property(property="password_confirmation", type="string", example="123456789")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation failed",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userRole = Role::where('name', '=', Role::USER)->first();
        $userRoleId = $userRole ? $userRole->id : null;
        $role_id = $request->role_id ?? $userRoleId;

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role_id' => $role_id
        ]);

        return response()->json($user, 201);
    }

    /**
     * @OA\Put(
     *     path="/api/users/{user_id}",
     *     tags={"Users"},
     *     summary="Update a user",
     *     description="Updates a user's `name`, `active` or `password`. If updating `password`, `password_confirmation` is required and must match.",
     *     @OA\Parameter(
     *         name="user_id",
     *         in="path",
     *         required=true,
     *         description="ID of the user to update",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="name", type="string", example="bbb"),
     *                 @OA\Property(property="password", type="string", example="123456789"),
     *                 @OA\Property(property="password_confirmation", type="string", example="123456789"),
     *                 @OA\Property(property="active", type="boolean", example="false")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User id 1 not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation failed",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $user_id)
    {
        $user = $request->user(); 

        $role = $user->role();
        if(!$role || !$role->can(RolePermission::UPDATE_SELF))
        {
            abort(400, "lala");
            // return response()->json([
            //     'message' => 'Operation not permitted',
            //     'errors' => ["Role" => "Invalid Permissions"]
            // ], 401 );
        }

        $userToUpdate = User::find($user_id);

        if($role && $userToUpdate->id != $user->id && !$role->can(RolePermission::UPDATE_USER))
        {
            abort(400, "lalaland");
            // return response()->json([
            //     'message' => 'Operation not permitted',
            //     'errors' => ["Role" => "Invalid Permissions"]
            // ], 401 );
        }

        $validator = Validator::make($request->all(), [
            'email' => 'string|max:255',
            'password' => 'string|min:8|confirmed',
            'role_id' => 'int',
            'active' => 'boolean'
        ]);

        if ($validator->fails()) 
        {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        if(!$userToUpdate)
            abort(404, 'User' . $user_id . ' not found');

        if($request->has('name'))
        {
            $userToUpdate->name = $request->name;
        }
        if($request->has('active') && $role && $role->can(RolePermission::DEACTIVATE_USER))
        {
            $userToUpdate->active = $request->active;
        }
        if($request->has('role_id') && $role && $role->hasAtLeastPermissionsOfRoleid($request->role_id))
        {
            $userToUpdate->role_id = $request->role_id;
        }
        if($request->has('password', 'password_confirmation'))
        {
            if($request->has('password_confirmation'))
            {

                if($request->password == $request->password_confirmation)
                    $userToUpdate->password = bcrypt($request->password);
                else
                    return response()->json([
                        'message' => 'Validation failed',
                        'errors' => ['password_confirmation' => "the fields password and password_confirmation don't match"]
                    ],422);
            }
            else
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => ['password_confirmation' => "The field password_confirmation is missing"]
                ],422);
        }

        $userToUpdate->save();
    
        return response()->json($userToUpdate, 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{user_id}",
     *     tags={"Users"},
     *     summary="Soft delete a user",
     *     description="Sets the user's `active` status to false instead of permanently deleting the record.",
     *     @OA\Parameter(
     *         name="user_id",
     *         in="path",
     *         required=true,
     *         description="ID of the user to deactivate",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="User deactivated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/User")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="User not found",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="message", type="string", example="User id 1 not found")
     *         )
     *     )
     * )
     */
    public function destroy(Request $request, $user_id)
    {
        $hard = filter_var($request->query('hard', false), FILTER_VALIDATE_BOOLEAN);

        $user = $request->user(); 
        $role = $user->role();

        if (!$role) {
            return response()->json([
                'message' => 'Operation not permitted',
                'errors' => ["Role" => "No role assigned"]
            ], 401);
        }

        // Self-delete
        if ($user->id == $user_id) {
            if (!$role->can(RolePermission::DELETE_SELF)) {
                return response()->json([
                    'message' => 'Operation not permitted',
                    'errors' => ["Role" => "DELETE_SELF permission required"]
                ], 401);
            }

            if ($hard) {
                $user->delete();
                return response()->json(['message' => 'User deleted'], 200);
            } else {
                $user->active = false;
                $user->save();
                return response()->json(['message' => 'User deactivated'], 200);
            }
        }

        // Deleting or deactivating another user
        if ($hard && !$role->can(RolePermission::DELETE_USER)) {
            return response()->json([
                'message' => 'Operation not permitted',
                'errors' => ["Role" => "DELETE_USER permission required"]
            ], 401);
        }

        if (!$hard && !$role->can(RolePermission::DEACTIVATE_USER)) {
            return response()->json([
                'message' => 'Operation not permitted',
                'errors' => ["Role" => "DEACTIVATE_USER permission required"]
            ], 401);
        }

        $userToDelete = User::find($user_id);
        if (!$userToDelete) {
            return response()->json(['message' => 'User ' . $user_id . ' not found'], 404);
        }

        if ($hard) {
            $userToDelete->delete();
            return response()->json(['message' => 'User deleted'], 200);
        } else {
            $userToDelete->active = false;
            $userToDelete->save();
            return response()->json(['message' => 'User deactivated'], 200);
        }
    }

    public function roles(Request $request, $user_id)
    {
        return response()->json(Role::all());
    }

    
}
