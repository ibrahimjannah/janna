import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function OrderDetails({ order }) {
    return (
        <MainLayout>
            <Head title="Order Details" />
            <div className="min-h-screen py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href={route('orders.index')} className="text-gray-300 hover:text-white mb-8 inline-flex items-center transition">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Orders
                    </Link>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl p-8 mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 border-b border-white/10 pb-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2">Order Details</h1>
                                <p className="text-xl text-royal-gold font-bold">#{order.order_number}</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${order.delivery_status === 'delivered' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                    order.delivery_status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    }`}>
                                    {order.delivery_status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Delivery Address */}
                            <div>
                                <h3 className="font-bold text-white mb-4 text-lg border-b border-white/10 pb-2">Delivery Address</h3>
                                <div className="text-gray-300">
                                    <p className="text-lg mb-1">{order.delivery_address.address_line_1}</p>
                                    {order.delivery_address.address_line_2 && (
                                        <p className="text-lg mb-1">{order.delivery_address.address_line_2}</p>
                                    )}
                                    <p className="text-lg mb-2">{order.delivery_address.city} {order.delivery_address.postcode}</p>
                                    <p className="text-gray-400"><i className="fas fa-phone mr-2 text-xs"></i> {order.delivery_address.phone}</p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="font-bold text-white mb-4 text-lg border-b border-white/10 pb-2">Payment Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-400">Method</span>
                                        <span className="font-medium text-white">{order.payment_method.toUpperCase().replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between text-base">
                                        <span className="text-gray-400">Status</span>
                                        <span className={`font-bold ${order.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'
                                            }`}>
                                            {order.payment_status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-8">
                            <h3 className="font-bold text-white mb-6 text-lg border-b border-white/10 pb-2">Order Items</h3>
                            <div className="space-y-4">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition">
                                        <div className="flex items-center gap-4">
                                            {item.menu.image && (
                                                <img
                                                    src={item.menu.image}
                                                    alt={item.menu.name}
                                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                />
                                            )}
                                            <div>
                                                <p className="font-bold text-white text-lg">{item.menu.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    £{parseFloat(item.price).toFixed(2)} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-royal-gold text-lg">£{parseFloat(item.subtotal).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-black/20 rounded-xl p-6 border border-white/5 space-y-3">
                            <div className="flex justify-between text-gray-300">
                                <span>Subtotal</span>
                                <span>£{parseFloat(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Tax</span>
                                <span>£{parseFloat(order.tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Delivery Fee</span>
                                <span>£{parseFloat(order.delivery_fee).toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-green-400">
                                    <span>Discount</span>
                                    <span>-£{parseFloat(order.discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-2xl font-bold text-white pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span className="text-royal-gold">£{parseFloat(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {order.delivery_status !== 'delivered' && order.delivery_status !== 'cancelled' && (
                        <Link
                            href={route('orders.track', order.id)}
                            className="block w-full bg-royal-gold text-royal-brown text-center py-4 rounded-full hover:bg-white transition duration-300 font-bold shadow-lg text-lg"
                        >
                            Track Order
                        </Link>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
