<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerOrderController extends Controller
{
    /**
     * Display customer's order history
     */
    public function index(Request $request)
    {
        $query = Order::where('customer_id', auth()->id())
            ->with(['orderItems.menu', 'deliveryAddress', 'review'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('delivery_status', $request->status);
        }

        $orders = $query->paginate(10);

        return Inertia::render('Orders/History', [
            'orders' => $orders,
            'filters' => $request->only(['status'])
        ]);
    }

    /**
     * Display order details
     */
    public function show(Order $order)
    {
        // Verify order belongs to user
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['orderItems.menu', 'deliveryAddress', 'payments']);

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Track order status
     */
    public function track(Order $order)
    {
        // Verify order belongs to user
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['orderItems.menu', 'deliveryAddress']);

        return Inertia::render('Orders/Track', [
            'order' => $order
        ]);
    }

    /**
     * Cancel order
     */
    public function cancel(Order $order)
    {
        // Verify order belongs to user
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        // Only allow cancellation if order is still pending
        if (!in_array($order->delivery_status, ['pending', 'preparing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be cancelled at this stage'
            ], 400);
        }

        $order->update([
            'status' => 'cancelled',
            'delivery_status' => 'cancelled'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully'
        ]);
    }
}
