<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display checkout page
     */
    public function index()
    {
        $cartItems = $this->getCartItems();
        
        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        $subtotal = $cartItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });
        
        $tax = $subtotal * 0.10; // 10% tax
        $deliveryFee = $this->calculateDeliveryFee(new Request(['subtotal' => $subtotal]));
        $total = $subtotal + $tax + $deliveryFee;

        $addresses = [];
        $defaultAddress = null;

        if (auth()->check()) {
            $addresses = auth()->user()->addresses;
            $defaultAddress = $addresses->where('is_default', true)->first();
        }

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems->load('menu'),
            'addresses' => $addresses,
            'defaultAddress' => $defaultAddress,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'deliveryFee' => $deliveryFee,
            'total' => $total,
        ]);
    }

    /**
     * Place order
     */
    public function store(Request $request)
    {
        $isGuest = !auth()->check();

        $validationRules = [
            'payment_method' => 'required|in:cash,card,digital',
            'delivery_instructions' => 'nullable|string|max:500',
        ];

        if ($isGuest) {
            $validationRules += [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'address_line1' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'postcode' => 'required|string|max:20',
                'phone' => 'required|string|max:20',
            ];
        } else {
            $validationRules['address_id'] = 'required|exists:addresses,id';
        }

        $request->validate($validationRules);

        $cartItems = $this->getCartItems();
        
        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Your cart is empty'
            ], 400);
        }

        DB::beginTransaction();
        
        try {
            $user = auth()->user();

            if ($isGuest) {
                // Create User
                $user = \App\Models\User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => \Illuminate\Support\Facades\Hash::make($request->password),
                ]);

                // Create Address
                $address = Address::create([
                    'user_id' => $user->id,
                    'line1' => $request->address_line1,
                    'city' => $request->city,
                    'postcode' => $request->postcode,
                    'is_default' => true,
                    // 'phone' => $request->phone, // Assuming address has phone or user has phone? checking schema...
                ]);
                
                // Login user
                auth()->login($user);
            } else {
                // Verify address belongs to user
                $address = Address::where('id', $request->address_id)
                    ->where('user_id', auth()->id())
                    ->firstOrFail();
            }

            // Calculate totals
            $subtotal = $cartItems->sum(function ($item) {
                return $item->price * $item->quantity;
            });
            
            $tax = $subtotal * 0.10;
            $deliveryFee = $this->calculateDeliveryFee(new Request(['subtotal' => $subtotal]));
            $total = $subtotal + $tax + $deliveryFee;

            // Create order
            $order = Order::create([
                'customer_id' => $user->id,
                'order_type' => 'delivery',
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => 0,
                'delivery_fee' => $deliveryFee,
                'total' => $total,
                'payment_status' => $request->payment_method === 'cash' ? 'unpaid' : 'pending',
                'payment_method' => $request->payment_method,
                'delivery_address_id' => $address->id,
                'delivery_instructions' => $request->delivery_instructions,
                'estimated_delivery_time' => now()->addMinutes(45),
                'delivery_status' => 'pending',
            ]);

            // Create order items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $cartItem->menu_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'subtotal' => $cartItem->price * $cartItem->quantity,
                ]);
            }

            // Clear cart
            $cartItems->each->delete();

            DB::commit();

            // Send order confirmation email
            try {
                \Illuminate\Support\Facades\Mail::to($user)->send(new \App\Mail\OrderPlaced($order));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send order placed email: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Order confirmation page
     */
    public function success(Order $order)
    {
        // Verify order belongs to user
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['orderItems.menu', 'deliveryAddress']);

        return Inertia::render('OrderConfirmation', [
            'order' => $order
        ]);
    }

    /**
     * Calculate delivery fee
     */
    public function calculateDeliveryFee(Request $request = null)
    {
        // Simple flat rate for now
        // In production, this could be based on distance, order value, etc.
        $baseFee = 5.00;
        
        // Free delivery over £30
        if ($request && $request->has('subtotal') && $request->subtotal >= 30) {
            return 0;
        }
        
        return $baseFee;
    }

    /**
     * Get cart items for current user
     */
    protected function getCartItems()
    {
        if (auth()->check()) {
            return CartItem::where('user_id', auth()->id())->get();
        }
        
        return CartItem::where('session_id', session()->getId())->get();
    }
}
