<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->customerOrders()->with('orderItems.menu')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'order_type' => 'required|in:takeaway,delivery',
            'delivery_address' => 'required_if:order_type,delivery|string',
            'total' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $order = Order::create([
                'customer_id' => $request->user()->id,
                'order_type' => $request->order_type,
                'status' => 'pending',
                'total' => $request->total,
                'payment_status' => 'pending',
                'delivery_address_id' => null, // Simplified for now, could use address model
                'notes' => $request->notes,
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['menu_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                    'status' => 'pending',
                ]);
            }

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load('orderItems.menu')
            ], 201);
        });
    }

    public function show(Order $order)
    {
        return response()->json($order->load('orderItems.menu', 'payments'));
    }
}
