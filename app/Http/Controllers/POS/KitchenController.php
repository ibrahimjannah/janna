<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KitchenController extends Controller
{
    /**
     * Display kitchen display system
     */
    public function index()
    {
        $orders = Order::with(['table', 'orderItems.menu'])
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('POS/Kitchen/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Get active kitchen orders (for real-time updates)
     */
    public function activeOrders()
    {
        $orders = Order::with(['table', 'orderItems.menu'])
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Update order item status
     */
    public function updateItemStatus(Request $request, OrderItem $orderItem)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,served'
        ]);

        $orderItem->update(['status' => $request->status]);

        // Check if all items are ready, update order status
        $order = $orderItem->order;
        $allItemsReady = $order->orderItems()->where('status', '!=', 'ready')->count() === 0;

        if ($allItemsReady && $order->status === 'preparing') {
            $order->update(['status' => 'ready']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item status updated'
        ]);
    }

    /**
     * Mark order as preparing
     */
    public function startPreparing(Order $order)
    {
        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Order is not in pending status'
            ], 400);
        }

        $order->update(['status' => 'preparing']);
        $order->orderItems()->update(['status' => 'preparing']);

        return response()->json([
            'success' => true,
            'message' => 'Order preparation started'
        ]);
    }

    /**
     * Mark order as ready
     */
    public function markReady(Order $order)
    {
        if ($order->status !== 'preparing') {
            return response()->json([
                'success' => false,
                'message' => 'Order is not being prepared'
            ], 400);
        }

        $order->update(['status' => 'ready']);
        $order->orderItems()->update(['status' => 'ready']);

        return response()->json([
            'success' => true,
            'message' => 'Order marked as ready'
        ]);
    }

    /**
     * Mark order as served
     */
    public function markServed(Order $order)
    {
        if ($order->status !== 'ready') {
            return response()->json([
                'success' => false,
                'message' => 'Order is not ready'
            ], 400);
        }

        $order->update(['status' => 'served']);
        $order->orderItems()->update(['status' => 'served']);

        return response()->json([
            'success' => true,
            'message' => 'Order marked as served'
        ]);
    }
}
