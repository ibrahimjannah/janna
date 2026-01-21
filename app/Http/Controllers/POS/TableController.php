<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    /**
     * Display table status view
     */
    public function index()
    {
        $tables = Table::with(['currentOrder.orderItems.menu'])->get();

        return Inertia::render('POS/Tables/Index', [
            'tables' => $tables
        ]);
    }

    /**
     * Assign order to table
     */
    public function assignOrder(Request $request, Table $table)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id'
        ]);

        $order = Order::find($request->order_id);

        if ($table->status === 'occupied' && $table->currentOrder) {
            return response()->json([
                'success' => false,
                'message' => 'Table is already occupied'
            ], 400);
        }

        $order->update(['table_id' => $table->id]);
        $table->update(['status' => 'occupied']);

        return response()->json([
            'success' => true,
            'message' => 'Order assigned to table'
        ]);
    }

    /**
     * Clear table
     */
    public function clear(Table $table)
    {
        // Check if table has unpaid orders
        if ($table->currentOrder && $table->currentOrder->payment_status !== 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot clear table with unpaid orders'
            ], 400);
        }

        $table->update(['status' => 'available']);

        return response()->json([
            'success' => true,
            'message' => 'Table cleared successfully'
        ]);
    }

    /**
     * Reserve table
     */
    public function reserve(Request $request, Table $table)
    {
        if ($table->status !== 'available') {
            return response()->json([
                'success' => false,
                'message' => 'Table is not available'
            ], 400);
        }

        $table->update(['status' => 'reserved']);

        return response()->json([
            'success' => true,
            'message' => 'Table reserved successfully'
        ]);
    }

    /**
     * Get table status (for real-time updates)
     */
    public function status()
    {
        $tables = Table::with(['currentOrder'])->get();

        return response()->json($tables);
    }
}
