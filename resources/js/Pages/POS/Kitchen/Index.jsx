import POSLayout from '@/Layouts/POSLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Index({ auth }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [lastOrderCount, setLastOrderCount] = useState(0);
    const audioRef = useRef(null);

    // Simple beep sound (Base64) to avoid external dependency
    const beepSound = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

    useEffect(() => {
        audioRef.current = new Audio(beepSound);
    }, []);

    const playAlert = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play failed (user interaction required first):", e));
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(route('pos.kitchen.orders'));
            const data = await response.json();

            // Play sound if new orders arrived
            if (data.length > lastOrderCount && lastOrderCount !== 0) {
                playAlert();
            }

            setLastOrderCount(data.length);
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching kitchen orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [lastOrderCount]);

    const updateItemStatus = async (itemId, status) => {
        try {
            await fetch(route('pos.kitchen.itemStatus', itemId), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
                body: JSON.stringify({ status })
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating item status:', error);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        let routeName = '';
        if (status === 'preparing') routeName = 'pos.kitchen.start';
        else if (status === 'ready') routeName = 'pos.kitchen.ready';
        else if (status === 'served') routeName = 'pos.kitchen.served';

        try {
            await fetch(route(routeName, orderId), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') }
            });
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

    const counts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        ready: orders.filter(o => o.status === 'ready').length
    };

    return (
        <POSLayout user={auth.user}>
            <Head title="Kitchen Display" />

            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-playfair font-bold text-royal-brown tracking-wider uppercase">Kitchen Display System</h1>

                {/* Filter Tabs */}
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                    {['all', 'pending', 'preparing', 'ready'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${filter === f
                                    ? 'bg-royal-brown text-royal-gold shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-royal-brown'
                                }`}
                        >
                            {f} <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-full ${filter === f ? 'bg-royal-gold text-royal-brown' : 'bg-gray-200 text-gray-600'}`}>{counts[f]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {loading && orders.length === 0 ? (
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-gold"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                    <div className="text-6xl mb-4 grayscale opacity-50">🍳</div>
                    <h2 className="text-xl font-bold text-gray-800">No {filter !== 'all' ? filter : ''} orders found</h2>
                    <p className="text-gray-500">
                        {filter === 'all' ? 'New orders will appear here automatically' : `Switch to 'All' to see other orders`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden flex flex-col animate-fadeIn">
                            {/* Order Header */}
                            <div className={`p-4 flex justify-between items-center ${order.status === 'pending' ? 'bg-royal-spice/10 border-l-4 border-l-royal-spice' :
                                order.status === 'preparing' ? 'bg-royal-brown/10 border-l-4 border-l-royal-brown' : 'bg-royal-gold/10 border-l-4 border-l-royal-gold'
                                } border-b border-royal-brown/5`}>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">#{order.order_number}</h3>
                                    <p className="text-sm font-bold text-gray-600 uppercase">
                                        {order.table ? `Table ${order.table.table_number}` : order.order_type}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-500">
                                        {Math.floor((new Date() - new Date(order.created_at)) / 60000)} mins ago
                                    </p>
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${order.status === 'pending' ? 'border-royal-spice text-royal-spice bg-white' :
                                        order.status === 'preparing' ? 'border-royal-brown text-royal-brown bg-white' : 'border-royal-gold text-royal-brown bg-white'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[300px]">
                                {order.order_items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-3 rounded-xl border-2 flex justify-between items-start transition ${item.status === 'ready' ? 'border-royal-gold/10 bg-royal-gold/5 opacity-60' : 'border-royal-brown/5'
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <span className="w-8 h-8 bg-royal-brown text-royal-cream rounded-lg flex items-center justify-center font-bold mr-3 shadow-sm border border-royal-gold/20">
                                                    {item.quantity}
                                                </span>
                                                <p className="font-bold text-royal-brown text-lg font-poppins leading-tight">{item.menu.name}</p>
                                            </div>
                                            {item.special_instructions && (
                                                <div className="mt-2 text-xs font-bold text-red-600 bg-red-50 p-2 rounded flex items-start">
                                                    <span className="mr-1">⚠️</span> {item.special_instructions}
                                                </div>
                                            )}
                                        </div>
                                        {item.status !== 'ready' && (
                                            <button
                                                onClick={() => updateItemStatus(item.id, 'ready')}
                                                className="ml-4 p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-royal-gold hover:text-royal-brown transition-all shadow-sm group"
                                                title="Mark as ready"
                                            >
                                                <span className="group-hover:scale-110 block">✅</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Action Footer */}
                            <div className="p-4 border-t bg-gray-50 flex gap-2">
                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                                        className="w-full bg-royal-brown text-royal-cream font-bold py-3 rounded-xl hover:bg-black transition uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span>🔥</span> Start Cooking
                                    </button>
                                )}
                                {order.status === 'preparing' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'ready')}
                                        className="w-full bg-royal-gold text-royal-brown font-bold py-3 rounded-xl hover:bg-amber-500 transition uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span>🔔</span> Mark Ready
                                    </button>
                                )}
                                {order.status === 'ready' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'served')}
                                        className="w-full bg-royal-spice text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition uppercase tracking-widest shadow-md flex items-center justify-center gap-2"
                                    >
                                        <span>🍽️</span> Mark Served
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </POSLayout>
    );
}
