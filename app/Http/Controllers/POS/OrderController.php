<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display POS order interface
     */
    public function index()
    {
        $tables = Table::with(['currentOrder'])->get();
        $categories = \App\Models\Category::with('menus')->get();

        return Inertia::render('POS/Orders/Index', [
            'tables' => $tables,
            'categories' => $categories
        ]);
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $request->validate([
            'table_id' => 'nullable|exists:tables,id',
            'order_type' => 'required|in:dine-in,takeaway,delivery',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.special_instructions' => 'nullable|string'
        ]);

        // Generate unique order number
        $orderNumber = 'ORD-' . strtoupper(Str::random(8));

        // Calculate totals
        $subtotal = 0;
        foreach ($request->items as $item) {
            $menu = Menu::find($item['menu_id']);
            $subtotal += $menu->price * $item['quantity'];
        }

        $tax = $subtotal * 0.1; // 10% tax
        $discount = $request->discount ?? 0;
        $total = $subtotal + $tax - $discount;

        // Create order
        $order = Order::create([
            'order_number' => $orderNumber,
            'table_id' => $request->table_id,
            'customer_id' => $request->customer_id,
            'order_type' => $request->order_type,
            'status' => 'pending',
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => $discount,
            'total' => $total,
            'payment_status' => 'unpaid',
            'notes' => $request->notes,
            'staff_id' => auth()->id()
        ]);

        // Create order items
        foreach ($request->items as $item) {
            $menu = Menu::find($item['menu_id']);
            $itemSubtotal = $menu->price * $item['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'menu_id' => $item['menu_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $menu->price,
                'subtotal' => $itemSubtotal,
                'special_instructions' => $item['special_instructions'] ?? null,
                'status' => 'pending'
            ]);
        }

        // Update table status if dine-in
        if ($request->table_id) {
            Table::find($request->table_id)->update(['status' => 'occupied']);
        }

        return response()->json([
            'success' => true,
            'order' => $order->load('orderItems.menu'),
            'message' => 'Order created successfully'
        ]);
    }

    /**
     * Display specific order
     */
    public function show(Order $order)
    {
        $order->load(['table', 'customer', 'orderItems.menu', 'payments']);

        return Inertia::render('POS/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update order
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Recalculate totals
        $subtotal = 0;
        foreach ($request->items as $item) {
            $menu = Menu::find($item['menu_id']);
            $subtotal += $menu->price * $item['quantity'];
        }

        $tax = $subtotal * 0.1;
        $discount = $request->discount ?? $order->discount;
        $total = $subtotal + $tax - $discount;

        // Update order
        $order->update([
            'subtotal' => $subtotal,
            'tax' => $tax,
            'discount' => $discount,
            'total' => $total,
            'notes' => $request->notes ?? $order->notes
        ]);

        // Delete existing items and create new ones
        $order->orderItems()->delete();

        foreach ($request->items as $item) {
            $menu = Menu::find($item['menu_id']);
            $itemSubtotal = $menu->price * $item['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'menu_id' => $item['menu_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $menu->price,
                'subtotal' => $itemSubtotal,
                'special_instructions' => $item['special_instructions'] ?? null,
                'status' => 'pending'
            ]);
        }

        return response()->json([
            'success' => true,
            'order' => $order->load('orderItems.menu'),
            'message' => 'Order updated successfully'
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,preparing,ready,served,completed,cancelled'
        ]);

        $order->update(['status' => $request->status]);

        // Send email notification if customer is attached
        if ($order->customer) {
            try {
                \Illuminate\Support\Facades\Mail::to($order->customer)->send(new \App\Mail\OrderStatusUpdated($order));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send status update email from POS: ' . $e->getMessage());
            }
        }

        // If completed and table order, clear the table
        if ($request->status === 'completed' && $order->table_id) {
            Table::find($order->table_id)->update(['status' => 'available']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order status updated'
        ]);
    }

    /**
     * Cancel order
     */
    public function cancel(Order $order)
    {
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel paid order'
            ], 400);
        }

        $order->update(['status' => 'cancelled']);

        // Clear table if applicable
        if ($order->table_id) {
            Table::find($order->table_id)->update(['status' => 'available']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled'
        ]);
    }

    /**
     * Get active orders
     */
    public function activeOrders()
    {
        $orders = Order::with(['table', 'orderItems.menu'])
            ->whereIn('status', ['pending', 'preparing', 'ready', 'served'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }
}
