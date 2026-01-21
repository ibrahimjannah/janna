<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display payment interface
     */
    public function create(Order $order)
    {
        $order->load(['orderItems.menu', 'table', 'payments']);

        return Inertia::render('POS/Payment/Create', [
            'order' => $order
        ]);
    }

    /**
     * Process payment
     */
    public function store(Request $request, Order $order)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,digital',
            'transaction_id' => 'nullable|string',
            'stripe_token' => 'nullable|string'
        ]);

        // Check if order is already fully paid
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Order is already paid'
            ], 400);
        }

        $transactionId = $request->transaction_id;

        // Optional: Stripe Integration logic
        if ($request->payment_method === 'card' && $request->stripe_token) {
            try {
                \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
                $charge = \Stripe\Charge::create([
                    'amount' => $request->amount * 100, // in cents
                    'currency' => 'gbp',
                    'source' => $request->stripe_token,
                    'description' => 'Order ' . $order->order_number
                ]);
                $transactionId = $charge->id;
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stripe Error: ' . $e->getMessage()
                ], 500);
            }
        }

        // Create payment record
        $payment = Payment::create([
            'order_id' => $order->id,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'transaction_id' => $transactionId,
            'status' => 'completed',
            'processed_by' => auth()->id()
        ]);

        // Calculate total paid
        $totalPaid = $order->payments()->where('status', 'completed')->sum('amount');

        // Update order payment status
        if ($totalPaid >= $order->total) {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'completed'
            ]);

            // Clear table if dine-in
            if ($order->table_id) {
                $order->table->update(['status' => 'available']);
            }
        } elseif ($totalPaid > 0) {
            $order->update(['payment_status' => 'partial']);
        }

        return response()->json([
            'success' => true,
            'payment' => $payment,
            'order' => $order->fresh(['payments']),
            'message' => 'Payment processed successfully'
        ]);
    }

    /**
     * Split bill payment
     */
    public function splitBill(Request $request, Order $order)
    {
        $request->validate([
            'splits' => 'required|array|min:2',
            'splits.*.amount' => 'required|numeric|min:0',
            'splits.*.payment_method' => 'required|in:cash,card,digital',
            'splits.*.transaction_id' => 'nullable|string'
        ]);

        $totalSplit = array_sum(array_column($request->splits, 'amount'));

        if ($totalSplit != $order->total) {
            return response()->json([
                'success' => false,
                'message' => 'Split amounts do not match order total'
            ], 400);
        }

        $payments = [];
        foreach ($request->splits as $split) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $split['amount'],
                'payment_method' => $split['payment_method'],
                'transaction_id' => $split['transaction_id'] ?? null,
                'status' => 'completed',
                'processed_by' => auth()->id()
            ]);
            $payments[] = $payment;
        }

        // Update order status
        $order->update([
            'payment_status' => 'paid',
            'status' => 'completed'
        ]);

        // Clear table if dine-in
        if ($order->table_id) {
            $order->table->update(['status' => 'available']);
        }

        return response()->json([
            'success' => true,
            'payments' => $payments,
            'order' => $order->fresh(['payments']),
            'message' => 'Split bill processed successfully'
        ]);
    }

    /**
     * Apply discount to order
     */
    public function applyDiscount(Request $request, Order $order)
    {
        $request->validate([
            'discount' => 'required|numeric|min:0|max:' . $order->subtotal
        ]);

        $total = $order->subtotal + $order->tax - $request->discount;

        $order->update([
            'discount' => $request->discount,
            'total' => $total
        ]);

        return response()->json([
            'success' => true,
            'order' => $order,
            'message' => 'Discount applied successfully'
        ]);
    }

    /**
     * Generate receipt
     */
    public function receipt(Order $order)
    {
        $order->load(['orderItems.menu', 'table', 'payments', 'customer']);

        return Inertia::render('POS/Payment/Receipt', [
            'order' => $order
        ]);
    }

    /**
     * Refund payment
     */
    public function refund(Request $request, Payment $payment)
    {
        $request->validate([
            'reason' => 'nullable|string'
        ]);

        if ($payment->status === 'refunded') {
            return response()->json([
                'success' => false,
                'message' => 'Payment already refunded'
            ], 400);
        }

        $payment->update([
            'status' => 'refunded'
        ]);

        // Update order payment status
        $order = $payment->order;
        $totalPaid = $order->payments()->where('status', 'completed')->sum('amount');

        if ($totalPaid == 0) {
            $order->update(['payment_status' => 'unpaid']);
        } elseif ($totalPaid < $order->total) {
            $order->update(['payment_status' => 'partial']);
        }

        return response()->json([
            'success' => true,
            'payment' => $payment,
            'message' => 'Payment refunded successfully'
        ]);
    }
}
