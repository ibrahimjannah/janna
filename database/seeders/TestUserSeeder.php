<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\StaffRole;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@indianroyaldine.com'],
            [
                'name' => 'Admin User',
                'username' => 'admin',
                'password' => Hash::make('password123'),
                'is_admin' => true,
            ]
        );

        // Create POS Staff Users
        $manager = User::updateOrCreate(
            ['email' => 'manager@indianroyaldine.com'],
            [
                'name' => 'Restaurant Manager',
                'username' => 'manager',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]
        );

        StaffRole::updateOrCreate(
            ['user_id' => $manager->id],
            ['role' => 'manager']
        );

        $waiter = User::updateOrCreate(
            ['email' => 'waiter@indianroyaldine.com'],
            [
                'name' => 'Waiter Staff',
                'username' => 'waiter',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]
        );

        StaffRole::updateOrCreate(
            ['user_id' => $waiter->id],
            ['role' => 'waiter']
        );

        $cashier = User::updateOrCreate(
            ['email' => 'cashier@indianroyaldine.com'],
            [
                'name' => 'Cashier Staff',
                'username' => 'cashier',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]
        );

        StaffRole::updateOrCreate(
            ['user_id' => $cashier->id],
            ['role' => 'cashier']
        );

        // Create Regular Customer
        User::updateOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'John Customer',
                'username' => 'customer',
                'password' => Hash::make('password123'),
                'is_admin' => false,
            ]
        );

        $this->command->info('Test users created successfully!');
    }
}
