import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function OrderTracking({ order }) {
    const [cancelling, setCancelling] = useState(false);

    const statuses = [
        { key: 'pending', label: 'Order Placed', icon: '📝' },
        { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚗' },
        { key: 'delivered', label: 'Delivered', icon: '✅' },
    ];

    const getCurrentStatusIndex = () => {
        return statuses.findIndex(s => s.key === order.delivery_status);
    };

    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        setCancelling(true);
        try {
            await axios.post(route('orders.cancel', order.id));
            router.reload();
        } catch (error) {
            alert('Failed to cancel order: ' + (error.response?.data?.message || error.message));
            setCancelling(false);
        }
    };

    const canCancel = ['pending', 'preparing'].includes(order.delivery_status);

    return (
        <MainLayout>
            <Head title="Track Order" />
            <div className="min-h-screen py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href={route('orders.index')} className="text-gray-300 hover:text-white mb-8 inline-flex items-center transition">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Orders
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-2 drop-shadow-md">Track Your Order</h1>
                    <p className="text-gray-400 mb-10 text-lg">Order #{order.order_number}</p>

                    {/* Order Status Timeline */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl p-10 mb-8">
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute left-0 top-8 w-full h-1 bg-white/10 rounded-full">
                                <div
                                    className="h-full bg-royal-gold transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                    style={{ width: `${(getCurrentStatusIndex() / (statuses.length - 1)) * 100}%` }}
                                />
                            </div>

                            {/* Status Steps */}
                            <div className="relative flex justify-between">
                                {statuses.map((status, index) => {
                                    const isCompleted = index <= getCurrentStatusIndex();
                                    const isCurrent = status.key === order.delivery_status;

                                    return (
                                        <div key={status.key} className="flex flex-col items-center" style={{ flex: 1 }}>
                                            <div
                                                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 transition-all duration-500 z-10 ${isCompleted
                                                    ? 'bg-royal-gold text-royal-brown shadow-lg scale-110'
                                                    : 'bg-black/80 border-2 border-white/10 text-gray-500'
                                                    } ${isCurrent && 'ring-4 ring-royal-gold/30 ring-opacity-50 animate-pulse-slow'}`}
                                            >
                                                {status.icon}
                                            </div>
                                            <p className={`text-sm font-bold text-center transition-colors duration-300 ${isCompleted ? 'text-white' : 'text-gray-600'}`}>
                                                {status.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {order.delivery_status === 'cancelled' && (
                            <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 font-bold text-center text-lg"><i className="fas fa-times-circle mr-2"></i> This order has been cancelled</p>
                            </div>
                        )}
                    </div>

                    {/* Estimated Delivery Time */}
                    {order.delivery_status !== 'delivered' && order.delivery_status !== 'cancelled' && (
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 mb-8 text-center">
                            <h2 className="text-xl font-semibold text-gray-300 mb-3 uppercase tracking-widest">Estimated Delivery Time</h2>
                            <p className="text-4xl font-bold text-white font-playfair">
                                {new Date(order.estimated_delivery_time).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Delivery Address */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Delivery Address</h2>
                            <p className="text-gray-300 text-lg mb-1">{order.delivery_address.address_line_1}</p>
                            {order.delivery_address.address_line_2 && (
                                <p className="text-gray-300 text-lg mb-1">{order.delivery_address.address_line_2}</p>
                            )}
                            <p className="text-gray-300 text-lg mb-4">{order.delivery_address.city} {order.delivery_address.postcode}</p>
                            <p className="text-gray-400"><i className="fas fa-phone mr-2 text-xs"></i> {order.delivery_address.phone}</p>
                        </div>

                        {/* Order Items */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Items</h2>
                            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            {item.menu.image && (
                                                <img
                                                    src={item.menu.image}
                                                    alt={item.menu.name}
                                                    className="w-16 h-16 object-cover rounded-lg shadow-md group-hover:scale-105 transition duration-300"
                                                />
                                            )}
                                            <div>
                                                <p className="font-bold text-white">{item.menu.name}</p>
                                                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-royal-gold">£{parseFloat(item.subtotal).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 mt-6 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>£{parseFloat(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax</span>
                                    <span>£{parseFloat(order.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Delivery Fee</span>
                                    <span>£{parseFloat(order.delivery_fee).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span>£{parseFloat(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        {canCancel && (
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="bg-red-500/80 backdrop-blur-md text-white py-4 px-8 rounded-full hover:bg-red-600 transition font-bold disabled:bg-gray-600 shadow-lg md:min-w-[200px]"
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        )}
                        <a
                            href="tel:+441234567890"
                            className="bg-white/10 border border-white/20 text-white text-center py-4 px-8 rounded-full hover:bg-white hover:text-royal-brown transition font-bold shadow-lg md:min-w-[200px]"
                        >
                            <i className="fas fa-phone-alt mr-2"></i> Contact Restaurant
                        </a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
