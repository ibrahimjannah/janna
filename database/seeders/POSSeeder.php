<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Table;
use App\Models\User;
use App\Models\StaffRole;
use Illuminate\Support\Facades\Hash;

class POSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create tables
        $tables = [
            ['table_number' => 'T1', 'capacity' => 2, 'location' => 'Main Hall', 'status' => 'available'],
            ['table_number' => 'T2', 'capacity' => 4, 'location' => 'Main Hall', 'status' => 'available'],
            ['table_number' => 'T3', 'capacity' => 4, 'location' => 'Main Hall', 'status' => 'available'],
            ['table_number' => 'T4', 'capacity' => 6, 'location' => 'Main Hall', 'status' => 'available'],
            ['table_number' => 'T5', 'capacity' => 2, 'location' => 'Window Side', 'status' => 'available'],
            ['table_number' => 'T6', 'capacity' => 2, 'location' => 'Window Side', 'status' => 'available'],
            ['table_number' => 'T7', 'capacity' => 4, 'location' => 'Window Side', 'status' => 'available'],
            ['table_number' => 'T8', 'capacity' => 8, 'location' => 'Private Room', 'status' => 'available'],
            ['table_number' => 'T9', 'capacity' => 4, 'location' => 'Outdoor', 'status' => 'available'],
            ['table_number' => 'T10', 'capacity' => 4, 'location' => 'Outdoor', 'status' => 'available'],
        ];

        foreach ($tables as $table) {
            Table::updateOrCreate(
                ['table_number' => $table['table_number']],
                $table
            );
        }

        // Create staff users with roles
        $staffMembers = [
            [
                'name' => 'Manager User',
                'username' => 'manager',
                'email' => 'manager@indianroyaldine.com',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'role' => 'manager',
                'permissions' => ['orders', 'payments', 'tables', 'kitchen', 'reports']
            ],
            [
                'name' => 'Cashier User',
                'username' => 'cashier',
                'email' => 'cashier@indianroyaldine.com',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'role' => 'cashier',
                'permissions' => ['orders', 'payments']
            ],
            [
                'name' => 'Waiter User',
                'username' => 'waiter',
                'email' => 'waiter@indianroyaldine.com',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'role' => 'waiter',
                'permissions' => ['orders', 'tables']
            ],
            [
                'name' => 'Kitchen Staff',
                'username' => 'kitchen',
                'email' => 'kitchen@indianroyaldine.com',
                'password' => 'password',
                'is_admin' => false,
                'role' => 'kitchen',
                'permissions' => ['kitchen']
            ],
            [
                'name' => 'POS Terminal',
                'username' => 'pos',
                'email' => 'pos@indianroyaldine.co.uk',
                'password' => 'POS@1234!',
                'is_admin' => false,
                'role' => 'manager',
                'permissions' => ['orders', 'payments', 'tables', 'kitchen', 'reports']
            ],
        ];

        foreach ($staffMembers as $staffData) {
            $role = $staffData['role'];
            $permissions = $staffData['permissions'];
            $password = $staffData['password'] ?? 'password';
            
            unset($staffData['role'], $staffData['permissions'], $staffData['password']);

            $user = User::updateOrCreate(
                ['email' => $staffData['email']],
                array_merge($staffData, ['password' => Hash::make($password)])
            );

            // Update or create role
            StaffRole::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'role' => $role,
                    'permissions' => $permissions
                ]
            );
        }

        $this->command->info('POS tables and staff created successfully!');
    }
}
