<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@indianroyaldine.co.uk'],
            [
                'name' => 'Royal Admin',
                'username' => 'admin',
                'password' => \Illuminate\Support\Facades\Hash::make('Admin@1234!'),
                'is_admin' => true,
            ]
        );
    }
}
