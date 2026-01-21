<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .status-badge { 
            display: inline-block; 
            padding: 8px 15px; 
            background-color: #e2e8f0; 
            border-radius: 20px; 
            font-weight: bold; 
            margin: 10px 0;
            text-transform: capitalize;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Order Status Update</h2>
            <p>Order #{{ $order->order_number }}</p>
        </div>
        
        <p>Hi {{ $order->customer ? $order->customer->name : 'Valued Customer' }},</p>
        
        <p>The status of your order has changed to:</p>
        
        <div style="text-align: center;">
            <span class="status-badge">{{ str_replace('_', ' ', $order->status) }}</span>
        </div>

        @if($order->status == 'out_for_delivery')
            <p>Your order is on its way! Our driver is bringing it to you now.</p>
        @elseif($order->status == 'delivered')
            <p>Your order has been delivered. Enjoy your meal!</p>
        @elseif($order->status == 'preparing')
            <p>Our chefs are busy preparing your delicious food.</p>
        @endif

        <p style="margin-top: 30px;">
            <a href="{{ route('orders.show', $order) }}" style="color: #4f46e5;">View Order Details</a>
        </p>
    </div>
</body>
</html>
