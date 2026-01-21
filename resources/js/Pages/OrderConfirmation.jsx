import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function OrderConfirmation({ order }) {
    return (
        <MainLayout>
            <Head title="Order Confirmation" />
            <div className="min-h-screen py-16">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Success Message */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6 border border-green-500/30 animate-pulse-slow">
                            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-playfair font-bold text-white mb-2 drop-shadow-md">Order Confirmed!</h1>
                        <p className="text-gray-300 text-lg">Thank you for your order. We're preparing your delicious meal!</p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 mb-8">
                        <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/10">
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Order Number</p>
                                <p className="text-3xl font-bold text-royal-gold font-playfair">{order.order_number}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Estimated Delivery</p>
                                <p className="text-2xl font-bold text-white font-playfair">
                                    {new Date(order.estimated_delivery_time).toLocaleTimeString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="mb-8">
                            <h3 className="font-bold text-white mb-3 text-lg flex items-center">
                                <i className="fas fa-map-marker-alt text-royal-gold mr-3"></i> Delivery Address
                            </h3>
                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                <p className="text-gray-300 text-lg">{order.delivery_address.address_line_1}</p>
                                {order.delivery_address.address_line_2 && (
                                    <p className="text-gray-300 text-lg">{order.delivery_address.address_line_2}</p>
                                )}
                                <p className="text-gray-300 text-lg">{order.delivery_address.city} {order.delivery_address.postcode}</p>
                                <p className="text-gray-400 mt-2"><i className="fas fa-phone mr-2 text-xs"></i> {order.delivery_address.phone}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-8">
                            <h3 className="font-bold text-white mb-4 text-lg">Order Items</h3>
                            <div className="space-y-3">
                                {order.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-base border-b border-white/5 pb-2">
                                        <span className="text-gray-300"><span className="font-bold text-white">{item.quantity}x</span> {item.menu.name}</span>
                                        <span className="font-bold text-white">£{parseFloat(item.subtotal).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Total */}
                        <div className="mt-4 pt-4 space-y-3 bg-black/20 -mx-8 -mb-8 p-8 rounded-b-3xl">
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
                            <div className="flex justify-between text-2xl font-bold text-royal-gold pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span>£{parseFloat(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link
                            href={route('orders.track', order.id)}
                            className="bg-royal-gold text-royal-brown text-center py-4 px-8 rounded-full hover:bg-white transition duration-300 font-bold shadow-lg text-lg flex-1 md:flex-none md:min-w-[200px]"
                        >
                            Track Order
                        </Link>
                        <Link
                            href={route('menu')}
                            className="bg-transparent border border-white/30 text-white text-center py-4 px-8 rounded-full hover:bg-white/10 transition duration-300 font-bold flex-1 md:flex-none md:min-w-[200px]"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
