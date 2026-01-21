<?php

use App\Http\Controllers\ProfileController;
use App\Models\Menu;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('port')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Home', [
            'signatureDishes' => Menu::where('is_signature', true)->take(3)->get(),
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    })->name('home');

    Route::get('/menu', function () {
        $categories = App\Models\Category::with('menus')->get();
        $favorites = auth()->check() 
            ? auth()->user()->favorites()->pluck('menu_id')->toArray() 
            : [];
            
        // Get cart items for quantity display
        $cartItems = \App\Models\CartItem::query()
            ->when(auth()->check(), function($q) {
                $q->where('user_id', auth()->id());
            }, function($q) {
                $q->where('session_id', session()->getId());
            })
            ->pluck('quantity', 'menu_id')
            ->toArray();
            
        return Inertia::render('Menu', [
            'categories' => $categories,
            'userFavorites' => $favorites,
            'cartQuantities' => $cartItems,
        ]);
    })->name('menu');

    Route::get('/reservation', function () {
        return Inertia::render('Reservation');
    })->name('reservation');

    Route::post('/reservation', [App\Http\Controllers\ReservationController::class, 'store'])->name('reservation.store');

    Route::get('/contact', function () {
        return Inertia::render('Contact', [
            'subject' => request('subject')
        ]);
    })->name('contact');

    Route::post('/contact', [App\Http\Controllers\ContactController::class, 'submit'])->name('contact.submit');

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    // Cart Management (accessible to all)
    Route::get('/cart', [App\Http\Controllers\CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [App\Http\Controllers\CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/{cartItem}', [App\Http\Controllers\CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [App\Http\Controllers\CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart', [App\Http\Controllers\CartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/apply-coupon', [App\Http\Controllers\CartController::class, 'applyCoupon'])->name('cart.apply-coupon');
    Route::post('/cart/remove-coupon', [App\Http\Controllers\CartController::class, 'removeCoupon'])->name('cart.remove-coupon');
    Route::get('/api/cart/count', [App\Http\Controllers\CartController::class, 'count'])->name('cart.count');
    Route::get('/api/cart/details', [App\Http\Controllers\CartController::class, 'details'])->name('cart.details');
    Route::get('/api/cart/details_with_ids', [App\Http\Controllers\CartController::class, 'detailsWithIds'])->name('cart.details_with_ids');


    // Checkout (accessible to all, auth handled in controller)
    Route::get('/checkout', [App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [App\Http\Controllers\CheckoutController::class, 'store'])->name('checkout.store');
    Route::post('/checkout/delivery-fee', [App\Http\Controllers\CheckoutController::class, 'calculateDeliveryFee'])->name('checkout.delivery-fee');
    Route::get('/order/{order}/confirmation', [App\Http\Controllers\CheckoutController::class, 'success'])->name('order.confirmation');

    // Orders (authenticated only)
    Route::middleware('auth')->group(function () {
        // Customer Orders
        Route::get('/orders', [App\Http\Controllers\CustomerOrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [App\Http\Controllers\CustomerOrderController::class, 'show'])->name('orders.show');
        Route::get('/orders/{order}/track', [App\Http\Controllers\CustomerOrderController::class, 'track'])->name('orders.track');
        Route::post('/orders/{order}/cancel', [App\Http\Controllers\CustomerOrderController::class, 'cancel'])->name('orders.cancel');

        // Address Management
        Route::get('/addresses', [App\Http\Controllers\AddressController::class, 'index'])->name('addresses.index');
        Route::post('/addresses', [App\Http\Controllers\AddressController::class, 'store'])->name('addresses.store');
        Route::put('/addresses/{address}', [App\Http\Controllers\AddressController::class, 'update'])->name('addresses.update');
        Route::delete('/addresses/{address}', [App\Http\Controllers\AddressController::class, 'destroy'])->name('addresses.destroy');
        Route::post('/addresses/{address}/default', [App\Http\Controllers\AddressController::class, 'setDefault'])->name('addresses.default');

        // Payment
        Route::post('/payment/intent', [App\Http\Controllers\CustomerPaymentController::class, 'createIntent'])->name('payment.intent');
        Route::post('/payment/confirm', [App\Http\Controllers\CustomerPaymentController::class, 'confirm'])->name('payment.confirm');

        // Favorites
        Route::get('/favorites', [App\Http\Controllers\FavoriteController::class, 'index'])->name('favorites.index');
        Route::post('/favorites/{menu}', [App\Http\Controllers\FavoriteController::class, 'toggle'])->name('favorites.toggle');

        // Reviews
        Route::post('/orders/{order}/review', [App\Http\Controllers\ReviewController::class, 'store'])->name('reviews.store');
    });

    // Stripe Webhook (no auth)
    Route::post('/webhook/stripe', [App\Http\Controllers\CustomerPaymentController::class, 'webhook'])->name('webhook.stripe');

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    require __DIR__.'/auth.php';
});

// Apply rate limiting to customer login
Route::middleware(['port'])->group(function () {
    Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('login.post');
});

// Admin Routes (Port 8001)
Route::middleware(['port:admin'])->prefix('admin')->group(function () {
    Route::get('/login', [App\Http\Controllers\Admin\AdminAuthController::class, 'create'])->name('admin.login');
    Route::post('/login', [App\Http\Controllers\Admin\AdminAuthController::class, 'store'])
        ->middleware('throttle:3,1');
    
    Route::middleware(['auth', App\Http\Middleware\AdminMiddleware::class])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

        // Reservations
        Route::get('/reservations', [App\Http\Controllers\ReservationController::class, 'index'])->name('admin.reservations');
        
        // Menu Management
        Route::get('/menu', [App\Http\Controllers\Admin\AdminMenuController::class, 'index'])->name('admin.menu.index');
        Route::post('/menu', [App\Http\Controllers\Admin\AdminMenuController::class, 'store'])->name('admin.menu.store');
        Route::put('/menu/{menu}', [App\Http\Controllers\Admin\AdminMenuController::class, 'update'])->name('admin.menu.update');
        Route::delete('/menu/{menu}', [App\Http\Controllers\Admin\AdminMenuController::class, 'destroy'])->name('admin.menu.destroy');

        // Customer Management
        Route::get('/customers', [App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('admin.customers.index');
        Route::delete('/customers/{user}', [App\Http\Controllers\Admin\CustomerController::class, 'destroy'])->name('admin.customers.destroy');

        // Orders Management
        Route::get('/orders', [App\Http\Controllers\Admin\OrderController::class, 'index'])->name('admin.orders.index');
        Route::get('/orders/{order}', [App\Http\Controllers\Admin\OrderController::class, 'show'])->name('admin.orders.show');
        Route::patch('/orders/{order}/status', [App\Http\Controllers\Admin\OrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');
        Route::get('/api/orders/live', [App\Http\Controllers\Admin\OrderController::class, 'liveOrders'])
            ->middleware('auth')
            ->name('admin.orders.live');
        Route::get('/api/orders/stats', [App\Http\Controllers\Admin\OrderController::class, 'todayStats'])
            ->middleware('auth')
            ->name('admin.orders.stats');

        // Sales Analytics
        Route::get('/sales', [App\Http\Controllers\Admin\SalesController::class, 'index'])->name('admin.sales.index');

        // Table Management
        Route::get('/tables', [App\Http\Controllers\Admin\TableController::class, 'index'])->name('admin.tables.index');
        Route::post('/tables', [App\Http\Controllers\Admin\TableController::class, 'store'])->name('admin.tables.store');
        Route::put('/tables/{table}', [App\Http\Controllers\Admin\TableController::class, 'update'])->name('admin.tables.update');
        Route::patch('/tables/{table}/status', [App\Http\Controllers\Admin\TableController::class, 'updateStatus'])->name('admin.tables.updateStatus');
        Route::delete('/tables/{table}', [App\Http\Controllers\Admin\TableController::class, 'destroy'])->name('admin.tables.destroy');
        Route::post('/tables/{table}/clear', [App\Http\Controllers\Admin\TableController::class, 'clear'])->name('admin.tables.clear');
        Route::get('/api/tables/status', [App\Http\Controllers\Admin\TableController::class, 'getStatus'])
            ->middleware('auth')
            ->name('admin.tables.status');

        Route::post('/logout', [App\Http\Controllers\Admin\AdminAuthController::class, 'destroy'])->name('admin.logout');
    });
});

// POS Routes (Port 8002)
Route::middleware(['port:pos'])->prefix('pos')->group(function () {
    Route::get('/login', [App\Http\Controllers\POS\AuthController::class, 'create'])->name('pos.login');
    Route::post('/login', [App\Http\Controllers\POS\AuthController::class, 'store'])
        ->middleware('throttle:3,1');
    
    Route::middleware(['auth', App\Http\Middleware\POSMiddleware::class])->group(function () {
        // Dashboard
        Route::get('/dashboard', function () {
            return Inertia::render('POS/Dashboard');
        })->name('pos.dashboard');

        // Order Management
        Route::get('/orders', [App\Http\Controllers\POS\OrderController::class, 'index'])->name('pos.orders.index');
        Route::post('/orders', [App\Http\Controllers\POS\OrderController::class, 'store'])->name('pos.orders.store');
        Route::get('/orders/{order}', [App\Http\Controllers\POS\OrderController::class, 'show'])->name('pos.orders.show');
        Route::put('/orders/{order}', [App\Http\Controllers\POS\OrderController::class, 'update'])->name('pos.orders.update');
        Route::patch('/orders/{order}/status', [App\Http\Controllers\POS\OrderController::class, 'updateStatus'])->name('pos.orders.updateStatus');
        Route::post('/orders/{order}/cancel', [App\Http\Controllers\POS\OrderController::class, 'cancel'])->name('pos.orders.cancel');
        Route::get('/api/orders/active', [App\Http\Controllers\POS\OrderController::class, 'activeOrders'])
            ->middleware('auth')
            ->name('pos.orders.active');

        // Payment Processing
        Route::get('/orders/{order}/payment', [App\Http\Controllers\POS\PaymentController::class, 'create'])->name('pos.payment.create');
        Route::post('/orders/{order}/payment', [App\Http\Controllers\POS\PaymentController::class, 'store'])->name('pos.payment.store');
        Route::post('/orders/{order}/split-bill', [App\Http\Controllers\POS\PaymentController::class, 'splitBill'])->name('pos.payment.splitBill');
        Route::post('/orders/{order}/discount', [App\Http\Controllers\POS\PaymentController::class, 'applyDiscount'])->name('pos.payment.discount');
        Route::get('/orders/{order}/receipt', [App\Http\Controllers\POS\PaymentController::class, 'receipt'])->name('pos.payment.receipt');
        Route::post('/payments/{payment}/refund', [App\Http\Controllers\POS\PaymentController::class, 'refund'])->name('pos.payment.refund');

        // Table Management
        Route::get('/tables', [App\Http\Controllers\POS\TableController::class, 'index'])->name('pos.tables.index');
        Route::post('/tables/{table}/assign', [App\Http\Controllers\POS\TableController::class, 'assignOrder'])->name('pos.tables.assign');
        Route::post('/tables/{table}/clear', [App\Http\Controllers\POS\TableController::class, 'clear'])->name('pos.tables.clear');
        Route::post('/tables/{table}/reserve', [App\Http\Controllers\POS\TableController::class, 'reserve'])->name('pos.tables.reserve');
        Route::get('/api/tables/status', [App\Http\Controllers\POS\TableController::class, 'status'])
            ->middleware('auth')
            ->name('pos.tables.status');

        // Kitchen Display
        Route::get('/kitchen', [App\Http\Controllers\POS\KitchenController::class, 'index'])->name('pos.kitchen.index');
        Route::get('/api/kitchen/orders', [App\Http\Controllers\POS\KitchenController::class, 'activeOrders'])
            ->middleware('auth')
            ->name('pos.kitchen.orders');
        Route::patch('/kitchen/items/{orderItem}/status', [App\Http\Controllers\POS\KitchenController::class, 'updateItemStatus'])->name('pos.kitchen.itemStatus');
        Route::post('/kitchen/orders/{order}/start', [App\Http\Controllers\POS\KitchenController::class, 'startPreparing'])->name('pos.kitchen.start');
        Route::post('/kitchen/orders/{order}/ready', [App\Http\Controllers\POS\KitchenController::class, 'markReady'])->name('pos.kitchen.ready');
        Route::post('/kitchen/orders/{order}/served', [App\Http\Controllers\POS\KitchenController::class, 'markServed'])->name('pos.kitchen.served');

        Route::post('/logout', [App\Http\Controllers\POS\AuthController::class, 'destroy'])->name('pos.logout');
    });
});
