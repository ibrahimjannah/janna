<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Submit a review for an order
     */
    public function store(Request $request, Order $order)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        // Ensure user owns order
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        // Ensure review doesn't already exist
        if (Review::where('order_id', $order->id)->exists()) {
            return back()->with('error', 'You have already reviewed this order');
        }

        Review::create([
            'user_id' => auth()->id(),
            'order_id' => $order->id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return back()->with('success', 'Review submitted successfully');
    }
}
