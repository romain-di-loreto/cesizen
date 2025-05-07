<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Information;
use App\Models\BreathingExercice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        // Seed roles
        $this->artisan('db:seed', ['--class' => 'RoleSeeder']);
    }

    public function test_user_registration()
    {
        $response = $this->postJson('/api/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    public function test_login_successful()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/users/authenticate', [
            'email' => $user->email,
            'password' => 'password123'
        ]);

        $response->assertOk()->assertJsonStructure([
            'access_token', 'token_type', 'user'
        ]);
    }

    public function test_login_invalid()
    {
        $response = $this->postJson('/api/users/authenticate', [
            'email' => 'fake@example.com',
            'password' => 'wrongpass'
        ]);

        $response->assertUnauthorized();
    }

    public function test_get_user_by_id()
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/users/{$user->id}");
        $response->assertOk()->assertJson(['id' => $user->id]);
    }

    public function test_get_all_users_as_admin()
    {
        $adminRole = Role::where('name', Role::ADMIN)->first();
        $admin = User::factory()->create(['role_id' => $adminRole->id]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/users');
        $response->assertOk();
    }

    public function test_get_favorites_unauthorized()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/users/{$otherUser->id}/informations/favorites");
        $response->assertUnauthorized();
    }

    public function test_get_exercices_unauthorized()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/users/{$otherUser->id}/exercices");
        $response->assertUnauthorized();
    }

    public function test_token_validity()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/users/is-token-valid')
            ->assertOk()
            ->assertJson(['message' => 'Authentified']);
    }

    public function test_logout()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/users/logout')
            ->assertOk()
            ->assertJson(['message' => 'Logged out']);
    }

    public function test_user_update_self()
    {
        $user = User::factory()->create();
        $user->role_id = Role::where('name', Role::USER)->first()->id;
        $user->save();

        Sanctum::actingAs($user);

        $this->putJson("/api/users/{$user->id}", [
            'name' => 'Updated Name'
        ])->assertOk();

        $this->assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated Name']);
    }

    public function test_user_deactivation_self()
    {
        $role = Role::where('name', Role::USER)->first();
        $user = User::factory()->create(['role_id' => $role->id]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/users/{$user->id}", ['hard' => false])
            ->assertOk()
            ->assertJson(['message' => 'User deactivated']);
    }

    public function test_admin_can_delete_user()
    {
        $admin = User::factory()->create(['role_id' => Role::where('name', Role::ADMIN)->first()->id]);
        $target = User::factory()->create();

        Sanctum::actingAs($admin);

        $this->deleteJson("/api/users/{$target->id}?hard=true")
            ->assertOk()
            ->assertJson(['message' => 'User deleted']);
    }

    public function test_roles_list_for_admin()
    {
        $admin = User::factory()->create(['role_id' => Role::where('name', Role::ADMIN)->first()->id]);

        Sanctum::actingAs($admin);

        $this->getJson('/api/users/roles')->assertOk();
    }
}
