import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Cart({ cartItems, subtotal, tax, deliveryFee, total, appliedCoupon, discount }) {
    const [selectedDelivery, setSelectedDelivery] = useState('standard');
    const [couponProcessing, setCouponProcessing] = useState(false);

    const handleUpdateQuantity = (cartItemId, quantity) => {
        router.patch(route('cart.update', cartItemId), { quantity }, {
            preserveScroll: true,
        });
    };

    const handleRemoveItem = (cartItemId) => {
        if (confirm('Remove this item from cart?')) {
            router.delete(route('cart.remove', cartItemId), {
                preserveScroll: true,
            });
        }
    };

    const handleRemoveCoupon = () => {
        setCouponProcessing(true);
        router.post(route('cart.remove-coupon'), {}, {
            preserveScroll: true,
            onFinish: () => setCouponProcessing(false)
        });
    };

    const handleClearCart = () => {
        if (confirm('Clear entire cart?')) {
            router.delete(route('cart.clear'));
        }
    };

    // Calculate coupon suggestions
    const getCouponSuggestion = () => {
        const sub = parseFloat(subtotal);

        if (appliedCoupon) return null; // Don't suggest if already applied

        if (sub >= 1000) {
            return { code: 'ROYAL20FREE', discount: '20% Off + Free Delivery', current: sub, next: null };
        } else if (sub >= 500) {
            return { code: 'ROYAL15', discount: '15% Off', current: sub, next: { amount: 1000, code: 'ROYAL20FREE', discount: '20% Off + Free Delivery' } };
        } else if (sub >= 300) {
            return { code: 'ROYAL10', discount: '10% Off', current: sub, next: { amount: 500, code: 'ROYAL15', discount: '15% Off' } };
        } else if (sub >= 100) {
            return { code: 'ROYAL5', discount: '5% Off', current: sub, next: { amount: 300, code: 'ROYAL10', discount: '10% Off' } };
        } else if (sub < 100) {
            return { code: null, discount: null, current: sub, next: { amount: 100, code: 'ROYAL5', discount: '5% Off' } };
        }
        return null;
    };

    const suggestion = getCouponSuggestion();

    // Calculate delivery options
    const standardDelivery = parseFloat(deliveryFee);
    const premiumDelivery = standardDelivery + 3.00;
    const currentDeliveryFee = selectedDelivery === 'premium' ? premiumDelivery : standardDelivery;
    const finalTotal = parseFloat(subtotal) - parseFloat(discount || 0) + parseFloat(tax) + currentDeliveryFee;

    if (!cartItems || cartItems.length === 0) {
        return (
            <MainLayout>
                <Head title="Shopping Cart" />
                <div className="min-h-screen py-12 flex flex-col items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-16 rounded-3xl shadow-xl">
                            <i className="fas fa-shopping-basket text-royal-gold/50 text-8xl mb-6"></i>
                            <h2 className="text-4xl font-playfair font-bold text-white mb-4">Your cart is empty</h2>
                            <p className="text-gray-300 text-lg mb-8">Start adding some delicious royal dishes!</p>
                            <Link href={route('menu')} className="inline-block bg-royal-gold text-royal-brown px-10 py-4 rounded-full font-bold hover:bg-white transition duration-300 shadow-lg">
                                Browse Menu
                            </Link>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Shopping Cart" />
            <div className="min-h-screen py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white drop-shadow-md">Shopping Cart</h1>
                        <button
                            onClick={handleClearCart}
                            className="text-red-400 hover:text-red-300 text-sm font-medium transition flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-red-400/30"
                        >
                            <i className="fas fa-trash-alt mr-2"></i> Clear Cart
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 flex gap-6 hover:bg-black/50 transition duration-300">
                                    {item.menu.image && (
                                        <img
                                            src={item.menu.image}
                                            alt={item.menu.name}
                                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl shadow-md"
                                        />
                                    )}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-white mb-1">{item.menu.name}</h3>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-gray-400 hover:text-red-400 transition"
                                                >
                                                    <i className="fas fa-times text-xl"></i>
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-400 line-clamp-2">{item.menu.description}</p>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <p className="text-royal-gold font-bold text-lg">£{parseFloat(item.price).toFixed(2)}</p>

                                            <div className="flex items-center gap-3 bg-white/10 rounded-full px-2 py-1 border border-white/20">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 rounded-full bg-transparent hover:bg-white/20 flex items-center justify-center text-white transition"
                                                >
                                                    <i className="fas fa-minus text-xs"></i>
                                                </button>
                                                <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full bg-transparent hover:bg-white/20 flex items-center justify-center text-white transition"
                                                >
                                                    <i className="fas fa-plus text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl p-8 sticky top-24">
                                <h2 className="text-2xl font-playfair font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal</span>
                                        <span>£{parseFloat(subtotal).toFixed(2)}</span>
                                    </div>

                                    {/* Coupon Suggestion */}
                                    {suggestion && (
                                        <div className="bg-gradient-to-r from-royal-gold/10 to-yellow-600/10 border border-royal-gold/30 rounded-xl p-4 space-y-2">
                                            {suggestion.code ? (
                                                <>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <i className="fas fa-crown text-royal-gold text-sm"></i>
                                                        <p className="text-xs font-bold text-royal-gold uppercase tracking-wider">Royal Offer Available!</p>
                                                    </div>
                                                    <p className="text-sm text-gray-200">
                                                        Use code <span className="font-bold text-royal-gold">{suggestion.code}</span> for {suggestion.discount}
                                                    </p>
                                                    {suggestion.next && (
                                                        <p className="text-xs text-gray-400">
                                                            💡 Add £{(suggestion.next.amount - suggestion.current).toFixed(2)} more for {suggestion.next.code} ({suggestion.next.discount})
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-200">
                                                    💡 Add £{(suggestion.next.amount - suggestion.current).toFixed(2)} more to unlock {suggestion.next.code} ({suggestion.next.discount})
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Coupon Section */}
                                    <div className="pt-2">
                                        {appliedCoupon ? (
                                            <div className="flex justify-between items-center bg-green-500/10 border border-green-500/30 p-3 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <i className="fas fa-ticket-alt text-green-400"></i>
                                                    <div>
                                                        <p className="text-xs text-green-400 font-bold uppercase tracking-wider">{appliedCoupon.code}</p>
                                                        <p className="text-[10px] text-green-400/70">Applied successfully</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    disabled={couponProcessing}
                                                    className="text-green-400 hover:text-white hover:bg-green-500/20 w-8 h-8 flex items-center justify-center rounded-full transition-all disabled:opacity-50"
                                                    title="Remove coupon"
                                                >
                                                    <i className={`fas ${couponProcessing ? 'fa-spinner fa-spin' : 'fa-times'}`}></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                const code = e.target.coupon.value;
                                                setCouponProcessing(true);
                                                router.post(route('cart.apply-coupon'), { code }, {
                                                    onSuccess: (page) => {
                                                        if (page.props.flash?.success) e.target.reset();
                                                    },
                                                    onFinish: () => setCouponProcessing(false),
                                                    preserveScroll: true
                                                });
                                            }} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    name="coupon"
                                                    disabled={couponProcessing}
                                                    placeholder="Enter coupon code"
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:ring-royal-gold/50 focus:border-royal-gold transition-all disabled:opacity-50"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={couponProcessing}
                                                    className="bg-royal-gold/10 hover:bg-royal-gold text-royal-gold hover:text-royal-brown border border-royal-gold/30 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-tight disabled:opacity-50 min-w-[80px]"
                                                >
                                                    {couponProcessing ? <i className="fas fa-spinner fa-spin"></i> : 'Apply'}
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-400 font-bold">
                                            <span>Discount</span>
                                            <span>-£{parseFloat(discount).toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-gray-300">
                                        <span>Tax (10%)</span>
                                        <span>£{parseFloat(tax).toFixed(2)}</span>
                                    </div>

                                    {/* Delivery Options */}
                                    <div className="border-t border-white/10 pt-4">
                                        <p className="text-sm font-bold text-white mb-3">Delivery Options</p>
                                        <div className="space-y-2">
                                            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${selectedDelivery === 'standard' ? 'bg-royal-gold/10 border-royal-gold/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="delivery"
                                                        value="standard"
                                                        checked={selectedDelivery === 'standard'}
                                                        onChange={() => setSelectedDelivery('standard')}
                                                        className="text-royal-gold focus:ring-royal-gold"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Standard Delivery</p>
                                                        <p className="text-xs text-gray-400">30-45 minutes</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-bold ${selectedDelivery === 'standard' ? 'text-royal-gold' : 'text-gray-300'}`}>
                                                    {standardDelivery === 0 ? 'FREE' : `£${standardDelivery.toFixed(2)}`}
                                                </span>
                                            </label>
                                            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${selectedDelivery === 'premium' ? 'bg-royal-gold/10 border-royal-gold/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="delivery"
                                                        value="premium"
                                                        checked={selectedDelivery === 'premium'}
                                                        onChange={() => setSelectedDelivery('premium')}
                                                        className="text-royal-gold focus:ring-royal-gold"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-white">Premium Delivery</p>
                                                        <p className="text-xs text-gray-400">15-20 minutes ⚡</p>
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-bold ${selectedDelivery === 'premium' ? 'text-royal-gold' : 'text-gray-300'}`}>
                                                    £{premiumDelivery.toFixed(2)}
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/20 pt-4 flex justify-between text-2xl font-bold text-royal-gold">
                                        <span>Total</span>
                                        <span>£{finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link
                                    href={route('checkout.index')}
                                    className="block w-full bg-royal-gold text-royal-brown text-center py-4 rounded-full hover:bg-white transition duration-300 font-bold shadow-lg mb-4 text-lg"
                                >
                                    Proceed to Checkout
                                </Link>
                                <Link
                                    href={route('menu')}
                                    className="block w-full text-center py-2 text-gray-400 hover:text-white transition font-medium"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
