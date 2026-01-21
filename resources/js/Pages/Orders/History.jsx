import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Modal from '@/Components/Modal';

export default function OrderHistory({ orders, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        rating: 5,
        comment: '',
    });

    const openReviewModal = (order) => {
        setSelectedOrder(order);
        setReviewModalOpen(true);
        reset();
    };

    const submitReview = (e) => {
        e.preventDefault();
        post(route('reviews.store', selectedOrder.id), {
            onSuccess: () => {
                setReviewModalOpen(false);
                setSelectedOrder(null);
                reset();
            },
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
            preparing: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
            out_for_delivery: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
            delivered: 'bg-green-500/20 text-green-300 border border-green-500/30',
            cancelled: 'bg-red-500/20 text-red-300 border border-red-500/30',
        };
        return badges[status] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending',
            preparing: 'Preparing',
            out_for_delivery: 'Out for Delivery',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
        };
        return labels[status] || status;
    };

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        window.location.href = route('orders.index', { status });
    };

    return (
        <MainLayout>
            <Head title="Order History" />
            <div className="min-h-screen py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white drop-shadow-md">Order History</h1>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="appearance-none bg-black/40 backdrop-blur-md border border-white/20 text-white px-6 py-3 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-royal-gold cursor-pointer"
                            >
                                <option value="all" className="text-gray-900">All Orders</option>
                                <option value="pending" className="text-gray-900">Pending</option>
                                <option value="preparing" className="text-gray-900">Preparing</option>
                                <option value="out_for_delivery" className="text-gray-900">Out for Delivery</option>
                                <option value="delivered" className="text-gray-900">Delivered</option>
                                <option value="cancelled" className="text-gray-900">Cancelled</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>

                    {orders.data && orders.data.length > 0 ? (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 hover:bg-black/50 transition duration-300">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Order #{order.order_number}</p>
                                            <p className="text-sm text-gray-300">
                                                {new Date(order.created_at).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(order.delivery_status)}`}>
                                                {getStatusLabel(order.delivery_status)}
                                            </span>
                                            <p className="text-2xl font-bold text-royal-gold">£{parseFloat(order.total).toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-6 mb-6">
                                        <div className="flex flex-wrap gap-3">
                                            {order.order_items.slice(0, 3).map((item) => (
                                                <span key={item.id} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-gray-300">
                                                    <span className="font-bold text-white">{item.quantity}x</span> {item.menu.name}
                                                </span>
                                            ))}
                                            {order.order_items.length > 3 && (
                                                <span className="text-sm text-gray-500 py-1 px-2">
                                                    +{order.order_items.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <Link
                                            href={route('orders.show', order.id)}
                                            className="px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white hover:text-royal-brown transition duration-300 text-sm font-bold shadow-md"
                                        >
                                            View Details
                                        </Link>

                                        {order.delivery_status === 'delivered' && !order.review && (
                                            <button
                                                onClick={() => openReviewModal(order)}
                                                className="px-6 py-2.5 bg-royal-gold text-royal-brown rounded-full hover:bg-white transition duration-300 text-sm font-bold shadow-md"
                                            >
                                                Rate & Review
                                            </button>
                                        )}

                                        {order.delivery_status !== 'delivered' && order.delivery_status !== 'cancelled' && (
                                            <Link
                                                href={route('orders.track', order.id)}
                                                className="px-6 py-2.5 border border-royal-gold text-royal-gold rounded-full hover:bg-royal-gold hover:text-royal-brown transition duration-300 text-sm font-bold shadow-md"
                                            >
                                                Track Order
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {orders.links && orders.links.length > 3 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    {orders.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${link.active
                                                ? 'bg-royal-gold text-royal-brown'
                                                : 'bg-black/40 text-gray-300 hover:bg-white/10'
                                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl">
                            <i className="fas fa-receipt text-7xl text-gray-500 mb-6 font-thin"></i>
                            <h2 className="text-3xl font-playfair font-bold text-white mb-3">No orders yet</h2>
                            <p className="text-gray-400 mb-8">Start ordering some delicious food!</p>
                            <Link href={route('menu')} className="inline-block bg-royal-gold text-royal-brown px-10 py-3 rounded-full font-bold hover:bg-white transition duration-300 shadow-lg">
                                Browse Menu
                            </Link>
                        </div>
                    )}
                </div>

                <Modal show={reviewModalOpen} onClose={() => setReviewModalOpen(false)}>
                    <div className="p-8 bg-royal-brown border border-royal-gold/20 rounded-2xl">
                        <h2 className="text-2xl font-playfair font-bold text-white mb-2">
                            Rate your Order <span className="text-royal-gold">#{selectedOrder?.order_number}</span>
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">How was your royal experience?</p>

                        <form onSubmit={submitReview} className="mt-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Rating</label>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            className={`text-4xl focus:outline-none transition transform hover:scale-110 ${data.rating >= star ? 'text-royal-gold' : 'text-gray-600'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Comment (Optional)</label>
                                <textarea
                                    className="w-full bg-black/30 border border-white/10 rounded-xl shadow-inner text-white placeholder-gray-500 focus:border-royal-gold focus:ring focus:ring-royal-gold/20 p-4"
                                    rows="4"
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    placeholder="Tell us about your experience..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setReviewModalOpen(false)}
                                    className="px-6 py-2.5 bg-transparent border border-white/20 rounded-full font-bold text-gray-300 hover:bg-white/10 hover:text-white transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-2.5 bg-royal-gold border border-transparent rounded-full font-bold text-royal-brown hover:bg-white transition duration-300 shadow-lg"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </MainLayout>
    );
}
