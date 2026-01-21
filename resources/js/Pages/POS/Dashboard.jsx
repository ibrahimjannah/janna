import POSLayout from '@/Layouts/POSLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function POSDashboard({ auth }) {
    const [stats, setStats] = useState({
        total_sales: 0,
        total_orders: 0,
        active_orders: 0,
        completed_orders: 0
    });

    const [activeOrders, setActiveOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    fetch(route('admin.orders.stats')),
                    fetch(route('pos.orders.active'))
                ]);
                const [statsData, ordersData] = await Promise.all([
                    statsRes.json(),
                    ordersRes.json()
                ]);
                setStats(statsData);
                setActiveOrders(ordersData);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds for more reactivity

        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { label: 'Today\'s Sales', value: `£${stats.total_sales?.toFixed(2) || '0.00'}`, icon: '💰', color: 'bg-green-600' },
        { label: 'Total Orders', value: stats.total_orders || 0, icon: '📋', color: 'bg-royal-brown' },
        { label: 'Active Orders', value: stats.active_orders || 0, icon: '🔥', color: 'bg-royal-spice' },
        { label: 'Completed', value: stats.completed_orders || 0, icon: '✅', color: 'bg-royal-gold' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            preparing: 'bg-blue-100 text-blue-800',
            ready: 'bg-green-100 text-green-800',
            served: 'bg-purple-100 text-purple-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <POSLayout user={auth.user}>
            <Head title="POS Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-royal-brown rounded-xl p-8 text-white relative overflow-hidden border border-royal-gold/20 shadow-xl">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center"></div>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-playfair font-bold mb-2 text-royal-gold tracking-wider">
                            Welcome, {auth.user.name}!
                        </h1>
                        <p className="text-royal-cream/80 font-poppins font-medium uppercase tracking-widest text-sm">
                            Role: <span className="text-royal-gold">{auth.user.staffRole?.role || 'Staff'}</span> | {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-royal-brown/5">
                            <div className={`${stat.color} p-6 flex items-center justify-between`}>
                                <span className="text-4xl drop-shadow-md">{stat.icon}</span>
                                <span className="text-3xl font-bold text-white drop-shadow-sm">{stat.value}</span>
                            </div>
                            <div className="p-4 bg-royal-cream/30">
                                <p className="text-royal-brown font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a
                        href={route('pos.orders.index')}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🛒</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">New Order</h3>
                        <p className="text-gray-600">Create a new customer order</p>
                    </a>

                    <a
                        href={route('pos.tables.index')}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🪑</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Tables</h3>
                        <p className="text-gray-600">View and manage table status</p>
                    </a>

                    <a
                        href={route('pos.kitchen.index')}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                    >
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">👨‍🍳</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Kitchen Display</h3>
                        <p className="text-gray-600">View active kitchen orders</p>
                    </a>
                </div>

                {/* Active Orders */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Orders</h2>

                    {activeOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-lg">No active orders at the moment</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeOrders.map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-lg">{order.order_number}</p>
                                            <p className="text-sm text-gray-600">
                                                {order.table ? `Table ${order.table.table_number}` : order.order_type}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        {order.order_items?.length || 0} items
                                    </div>
                                    <div className="text-lg font-bold text-purple-600">
                                        £{order.total?.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </POSLayout>
    );
}
