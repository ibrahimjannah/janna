<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request)
    {
        $query = Order::with(['table', 'customer', 'orderItems.menu', 'payments', 'deliveryAddress'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where(function($q) use ($request) {
                $q->where('status', $request->status)
                  ->orWhere('delivery_status', $request->status);
            });
        }

        // Filter by order type
        if ($request->has('order_type') && $request->order_type !== 'all') {
            $query->where('order_type', $request->order_type);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by order number
        if ($request->has('search') && $request->search) {
            $query->where('order_number', 'like', '%' . $request->search . '%');
        }

        $orders = $query->paginate(20);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'order_type', 'date_from', 'date_to', 'search'])
        ]);
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        $order->load(['table', 'customer', 'orderItems.menu', 'payments', 'staff', 'deliveryAddress']);

        return response()->json($order);
    }

    /**
     * Update the order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,served,completed,cancelled,out_for_delivery,delivered'
        ]);

        $updateData = ['status' => $request->status];
        
        // Sync delivery status if applicable
        if ($order->order_type === 'delivery') {
            if (in_array($request->status, ['out_for_delivery', 'delivered'])) {
                $updateData['delivery_status'] = $request->status;
            } elseif ($request->status === 'cancelled') {
                $updateData['delivery_status'] = 'cancelled';
            }
        }

        $order->update($updateData);

        // Send email notification
        if ($order->customer) {
            try {
                \Illuminate\Support\Facades\Mail::to($order->customer)->send(new \App\Mail\OrderStatusUpdated($order));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send status update email: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Order status updated successfully');
    }

    /**
     * Get live orders (for real-time dashboard)
     */
    public function liveOrders()
    {
        $activeOrders = Order::with(['table', 'orderItems.menu'])
            ->whereIn('status', ['pending', 'preparing', 'ready', 'served'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($activeOrders);
    }

    /**
     * Get today's statistics
     */
    public function todayStats()
    {
        $today = now()->startOfDay();

        $stats = [
            'total_sales' => Order::where('created_at', '>=', $today)
                ->where('payment_status', 'paid')
                ->sum('total'),
            'total_orders' => Order::where('created_at', '>=', $today)->count(),
            'active_orders' => Order::whereIn('status', ['pending', 'preparing', 'ready', 'served'])->count(),
            'completed_orders' => Order::where('created_at', '>=', $today)
                ->where('status', 'completed')
                ->count(),
        ];

        return response()->json($stats);
    }
}
