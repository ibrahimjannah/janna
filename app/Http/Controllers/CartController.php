<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart
     */
    public function index()
    {
        $cartItems = $this->getCartItems();
        
        $subtotal = $cartItems->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        // Handle Coupon
        $discount = 0;
        $appliedCoupon = null;
        $couponCode = session('applied_coupon');
        
        if ($couponCode) {
            $coupon = \App\Models\Coupon::where('code', $couponCode)->first();
            if ($coupon && $coupon->isValid() && $subtotal >= $coupon->min_cart_amount) {
                $discount = $coupon->calculateDiscount($subtotal);
                $appliedCoupon = $coupon;
            } else {
                session()->forget('applied_coupon');
            }
        }
        
        $taxableAmount = $subtotal - $discount;
        $tax = max(0, $taxableAmount * 0.10); // 10% tax
        
        $deliveryFee = 5.00; // Default delivery fee
        if ($appliedCoupon && $appliedCoupon->free_delivery) {
            $deliveryFee = 0.00;
        }

        $total = $taxableAmount + $tax + $deliveryFee;
        
        return Inertia::render('Cart', [
            'cartItems' => $cartItems->load('menu'),
            'subtotal' => $subtotal,
            'discount' => $discount,
            'appliedCoupon' => $appliedCoupon,
            'tax' => $tax,
            'deliveryFee' => $deliveryFee,
            'total' => $total,
        ]);
    }

    /**
     * Apply a coupon to the cart
     */
    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $coupon = \App\Models\Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon) {
            $message = 'Invalid royal coupon code.';
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('error', $message);
            }
            return $request->wantsJson() 
                ? response()->json(['success' => false, 'message' => $message])
                : redirect()->back()->with('error', $message);
        }

        // Check if this coupon is already applied
        if (session('applied_coupon') === $coupon->code) {
            $message = 'This coupon is already applied to your cart.';
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('info', $message);
            }
            return $request->wantsJson()
                ? response()->json(['success' => false, 'message' => $message])
                : redirect()->back()->with('info', $message);
        }

        if (!$coupon->isValid()) {
            $message = 'This coupon has expired or is no longer active.';
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('error', $message);
            }
            return $request->wantsJson()
                ? response()->json(['success' => false, 'message' => $message])
                : redirect()->back()->with('error', $message);
        }

        $subtotal = $this->getCartItems()->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        if ($subtotal < $coupon->min_cart_amount) {
            $message = "This coupon requires a minimum order of £{$coupon->min_cart_amount}.";
            if ($request->header('X-Inertia')) {
                return redirect()->back()->with('error', $message);
            }
            return $request->wantsJson()
                ? response()->json(['success' => false, 'message' => $message])
                : redirect()->back()->with('error', $message);
        }

        session(['applied_coupon' => $coupon->code]);

        $message = 'Coupon applied successfully! 👑';
        
        // If it's a "pure" JSON request (from Chat Axios) and NOT Inertia
        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'discount_type' => $coupon->type,
                'discount_value' => $coupon->value,
                'free_delivery' => $coupon->free_delivery,
            ]);
        }

        return redirect()->back()->with('success', $message);
    }

    public function removeCoupon(Request $request)
    {
        session()->forget('applied_coupon');

        $message = 'Coupon removed';
        
        // If it's a "pure" JSON request (from Chat Axios) and NOT Inertia
        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'cart_count' => $this->getCartItems()->sum('quantity')
            ]);
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Add item to cart
     */
    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $menu = Menu::findOrFail($request->menu_id);
        
        // Check if item already exists in cart
        $cartItem = $this->getCartItems()
            ->where('menu_id', $request->menu_id)
            ->first();

        if ($cartItem) {
            // Update quantity
            $cartItem->update([
                'quantity' => $cartItem->quantity + $request->quantity
            ]);
        } else {
            // Create new cart item
            CartItem::create([
                'user_id' => auth()->id(),
                'session_id' => session()->getId(),
                'menu_id' => $request->menu_id,
                'quantity' => $request->quantity,
                'price' => $menu->price,
            ]);
        }

        $cartItems = $this->getCartItems();
        return response()->json([
            'success' => true,
            'message' => 'Item added to cart',
            'cart_count' => $cartItems->sum('quantity'),
            'subtotal' => $cartItems->sum(fn($i) => $i->price * $i->quantity)
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Verify ownership
        if (!$this->ownsCartItem($cartItem)) {
            abort(403);
        }

        $cartItem->update([
            'quantity' => $request->quantity
        ]);

        if ($request->wantsJson()) {
            $cartItems = $this->getCartItems();
            return response()->json([
                'success' => true,
                'message' => 'Cart updated',
                'cart_count' => $cartItems->sum('quantity'),
                'subtotal' => $cartItems->sum(fn($i) => $i->price * $i->quantity)
            ]);
        }

        return redirect()->back()->with('success', 'Cart updated');
    }

    /**
     * Remove item from cart
     */
    public function remove(Request $request, CartItem $cartItem)
    {
        // Verify ownership
        if (!$this->ownsCartItem($cartItem)) {
            abort(403);
        }

        $cartItem->delete();

        if ($request->wantsJson()) {
            $cartItems = $this->getCartItems();
            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart',
                'cart_count' => $cartItems->sum('quantity'),
                'subtotal' => $cartItems->sum(fn($i) => $i->price * $i->quantity)
            ]);
        }

        return redirect()->back()->with('success', 'Item removed from cart');
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        $this->getCartItems()->each->delete();

        return redirect()->back()->with('success', 'Cart cleared');
    }

    /**
     * Get cart item count (API)
     */
    public function count()
    {
        return response()->json([
            'count' => $this->getCartItems()->sum('quantity')
        ]);
    }

    /**
     * Get cart quantities for specific items (API)
     */
    public function details()
    {
        $quantities = $this->getCartItems()->pluck('quantity', 'menu_id');
        return response()->json($quantities);
    }

    /**
     * Get cart details including item IDs for easy removal (API)
     */
    public function detailsWithIds()
    {
        $details = $this->getCartItems()->mapWithKeys(function ($item) {
            return [$item->menu_id => [
                'id' => $item->id,
                'quantity' => $item->quantity
            ]];
        });
        return response()->json($details);
    }

    /**
     * Get cart items for current user/session
     */
    protected function getCartItems()
    {
        if (auth()->check()) {
            return CartItem::where('user_id', auth()->id())->get();
        }
        
        return CartItem::where('session_id', session()->getId())->get();
    }

    /**
     * Check if user owns cart item
     */
    protected function ownsCartItem(CartItem $cartItem)
    {
        if (auth()->check()) {
            return $cartItem->user_id === auth()->id();
        }
        
        return $cartItem->session_id === session()->getId();
    }
}
