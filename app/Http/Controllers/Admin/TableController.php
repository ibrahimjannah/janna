<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    /**
     * Display table management interface
     */
    public function index()
    {
        $tables = Table::with(['currentOrder.orderItems.menu'])->get();

        return Inertia::render('Admin/Tables/Index', [
            'tables' => $tables
        ]);
    }

    /**
     * Store a new table
     */
    public function store(Request $request)
    {
        $request->validate([
            'table_number' => 'required|unique:tables',
            'capacity' => 'required|integer|min:1',
            'location' => 'nullable|string'
        ]);

        $table = Table::create([
            'table_number' => $request->table_number,
            'capacity' => $request->capacity,
            'location' => $request->location,
            'status' => 'available'
        ]);

        return redirect()->back()->with('success', 'Table created successfully');
    }

    /**
     * Update table information
     */
    public function update(Request $request, Table $table)
    {
        $request->validate([
            'table_number' => 'required|unique:tables,table_number,' . $table->id,
            'capacity' => 'required|integer|min:1',
            'location' => 'nullable|string'
        ]);

        $table->update($request->only(['table_number', 'capacity', 'location']));

        return redirect()->back()->with('success', 'Table updated successfully');
    }

    /**
     * Update table status
     */
    public function updateStatus(Request $request, Table $table)
    {
        $request->validate([
            'status' => 'required|in:available,occupied,reserved'
        ]);

        $table->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Table status updated');
    }

    /**
     * Delete a table
     */
    public function destroy(Table $table)
    {
        // Check if table has active orders
        if ($table->currentOrder) {
            return redirect()->back()->with('error', 'Cannot delete table with active orders');
        }

        $table->delete();

        return redirect()->back()->with('success', 'Table deleted successfully');
    }

    /**
     * Get all tables with current status (for real-time updates)
     */
    public function getStatus()
    {
        $tables = Table::with(['currentOrder'])->get();

        return response()->json($tables);
    }

    /**
     * Clear table (mark as available)
     */
    public function clear(Table $table)
    {
        $table->update(['status' => 'available']);

        return redirect()->back()->with('success', 'Table cleared successfully');
    }
}
