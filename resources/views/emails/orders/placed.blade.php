<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .order-details { margin-top: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
        .total { font-weight: bold; font-size: 1.1em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Thank you for your order!</h2>
            <p>Order #{{ $order->order_number }}</p>
        </div>
        
        <p>Hi {{ $order->customer ? $order->customer->name : 'Valued Customer' }},</p>
        <p>We've received your order and are getting it ready.</p>

        <div class="order-details">
            <h3>Order Summary</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->menu->name }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>${{ number_format($item->price * $item->quantity, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2">Subtotal</td>
                        <td>${{ $order->subtotal }}</td>
                    </tr>
                    @if($order->delivery_fee > 0)
                    <tr>
                        <td colspan="2">Delivery Fee</td>
                        <td>${{ $order->delivery_fee }}</td>
                    </tr>
                    @endif
                    <tr class="total">
                        <td colspan="2">Total</td>
                        <td>${{ $order->total }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        @if($order->deliveryAddress)
        <div style="margin-top: 20px;">
            <h3>Delivery Address</h3>
            <p>
                {{ $order->deliveryAddress->address_line_1 }}<br>
                @if($order->deliveryAddress->address_line_2) {{ $order->deliveryAddress->address_line_2 }}<br> @endif
                {{ $order->deliveryAddress->city }}, {{ $order->deliveryAddress->postcode }}<br>
                Phone: {{ $order->deliveryAddress->phone }}
            </p>
        </div>
        @endif

        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
            You can track your order status in your account dashboard.
        </p>
    </div>
</body>
</html>
