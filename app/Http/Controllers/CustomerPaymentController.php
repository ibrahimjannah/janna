<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class CustomerPaymentController extends Controller
{
    /**
     * Create Stripe payment intent
     */
    public function createIntent(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id'
        ]);

        $order = Order::findOrFail($request->order_id);

        // Verify order belongs to user
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $paymentIntent = PaymentIntent::create([
                'amount' => $order->total * 100, // Convert to cents
                'currency' => 'gbp',
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Confirm payment
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_intent_id' => 'required|string',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Verify order belongs to user
        if ($order->customer_id !== auth()->id()) {
            abort(403);
        }

        try {
            Stripe::setApiKey(config('services.stripe.secret'));
            
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                // Create payment record
                Payment::create([
                    'order_id' => $order->id,
                    'amount' => $order->total,
                    'payment_method' => 'card',
                    'transaction_id' => $paymentIntent->id,
                    'status' => 'completed',
                    'processed_by' => auth()->id(),
                ]);

                // Update order payment status
                $order->update([
                    'payment_status' => 'paid'
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Payment not completed'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle Stripe webhook
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                $webhookSecret
            );

            // Handle different event types
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $paymentIntent = $event->data->object;
                    // Handle successful payment
                    break;

                case 'payment_intent.payment_failed':
                    $paymentIntent = $event->data->object;
                    // Handle failed payment
                    break;
            }

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
