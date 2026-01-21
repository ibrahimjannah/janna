<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            // Main Dining Area
            ['table_number' => 'T1', 'capacity' => 2, 'location' => 'Main Dining', 'status' => 'available'],
            ['table_number' => 'T2', 'capacity' => 2, 'location' => 'Main Dining', 'status' => 'available'],
            ['table_number' => 'T3', 'capacity' => 4, 'location' => 'Main Dining', 'status' => 'available'],
            ['table_number' => 'T4', 'capacity' => 4, 'location' => 'Main Dining', 'status' => 'available'],
            ['table_number' => 'T5', 'capacity' => 4, 'location' => 'Main Dining', 'status' => 'available'],
            ['table_number' => 'T6', 'capacity' => 6, 'location' => 'Main Dining', 'status' => 'available'],
            ['table_number' => 'T7', 'capacity' => 6, 'location' => 'Main Dining', 'status' => 'available'],
            ['table_number' => 'T8', 'capacity' => 8, 'location' => 'Main Dining', 'status' => 'available'],
            
            // Window Section
            ['table_number' => 'W1', 'capacity' => 2, 'location' => 'Window', 'status' => 'available'],
            ['table_number' => 'W2', 'capacity' => 2, 'location' => 'Window', 'status' => 'available'],
            ['table_number' => 'W3', 'capacity' => 4, 'location' => 'Window', 'status' => 'available'],
            
            // Private Room
            ['table_number' => 'P1', 'capacity' => 10, 'location' => 'Private Room', 'status' => 'available'],
            ['table_number' => 'P2', 'capacity' => 12, 'location' => 'Private Room', 'status' => 'available'],
            
            // Bar Area
            ['table_number' => 'B1', 'capacity' => 2, 'location' => 'Bar', 'status' => 'available'],
            ['table_number' => 'B2', 'capacity' => 2, 'location' => 'Bar', 'status' => 'available'],
        ];

        foreach ($tables as $table) {
            Table::create($table);
        }
    }
}
