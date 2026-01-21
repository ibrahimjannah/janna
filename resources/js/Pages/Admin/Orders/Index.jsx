import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, orders, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
        order_type: filters.order_type || 'all',
    });

    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('admin.orders.index'), {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-100 text-amber-800 border-amber-200',
            preparing: 'bg-sky-100 text-sky-800 border-sky-200',
            ready: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            served: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            completed: 'bg-slate-100 text-slate-800 border-slate-200',
            cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(route('admin.orders.show', orderId));
            const data = await response.json();
            setSelectedOrder(data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const updateStatus = (status) => {
        if (!confirm(`Are you sure you want to update status to ${status.toUpperCase()}?`)) return;

        router.patch(route('admin.orders.updateStatus', selectedOrder.id), {
            status: status
        }, {
            onSuccess: () => {
                setSelectedOrder(prev => ({ ...prev, status: status }));
                // Refresh list
                get(route('admin.orders.index'), {}, { preserveState: true });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Orders Management" />

            <div className="mb-12">
                <h1 className="text-4xl font-black text-royal-brown font-playfair tracking-tighter uppercase">Live Orders</h1>
                <p className="text-royal-brown/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Manage and monitor absolute culinary flow</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-royal-brown/5 mb-12">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-royal-brown/40 uppercase tracking-widest mb-3 px-1">Lookup ID</label>
                        <input
                            type="text"
                            value={data.search}
                            onChange={e => setData('search', e.target.value)}
                            placeholder="ORD-..."
                            className="w-full h-14 rounded-2xl border-royal-brown/5 bg-royal-cream/10 focus:border-royal-gold focus:ring-0 text-sm font-bold placeholder:text-royal-brown/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-royal-brown/40 uppercase tracking-widest mb-3 px-1">Current State</label>
                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            className="w-full h-14 rounded-2xl border-royal-brown/5 bg-royal-cream/10 focus:border-royal-gold focus:ring-0 text-sm font-bold transition-all"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="served">Served</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-royal-brown/40 uppercase tracking-widest mb-3 px-1">Dine Type</label>
                        <select
                            value={data.order_type}
                            onChange={e => setData('order_type', e.target.value)}
                            className="w-full h-14 rounded-2xl border-royal-brown/5 bg-royal-cream/10 focus:border-royal-gold focus:ring-0 text-sm font-bold transition-all"
                        >
                            <option value="all">All Types</option>
                            <option value="dine-in">Dine-in</option>
                            <option value="takeaway">Takeaway</option>
                            <option value="delivery">Delivery</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full h-14 bg-royal-brown text-royal-gold font-black rounded-2xl hover:bg-royal-gold hover:text-royal-brown transition duration-500 shadow-xl border border-white/5 text-[10px] uppercase tracking-[0.2em]"
                        >
                            Apply Filter
                        </button>
                    </div>
                </form>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-royal-brown/5 overflow-hidden mb-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-royal-brown text-white">
                                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-royal-gold/60">Order Reference</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-royal-gold/60">Timestamp</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-royal-gold/60">Consumer / Location</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-royal-gold/60">Service</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-royal-gold/60">Progress</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-royal-gold/60">Net Total</th>
                                <th className="p-6 font-black text-[10px] uppercase tracking-widest text-royal-gold/60 text-right">Discovery</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-royal-brown/5">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="group hover:bg-royal-cream/10 transition-colors duration-300">
                                    <td className="p-6 font-black text-royal-brown text-sm tracking-tight">{order.order_number}</td>
                                    <td className="p-6 text-[10px] font-bold text-royal-brown/40 uppercase tracking-widest">
                                        {new Date(order.created_at).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-royal-brown text-xs uppercase tracking-tight">{order.customer?.name || 'Walk-in Guest'}</span>
                                            {order.table && <span className="text-[9px] font-black text-royal-gold uppercase tracking-[0.2em] mt-1">Table {order.table.table_number}</span>}
                                            {order.order_type === 'delivery' && <span className="text-[9px] font-black text-royal-red uppercase tracking-[0.2em] mt-1">Delivery</span>}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest py-1.5 px-3 bg-royal-brown/5 rounded-lg text-royal-brown">{order.order_type}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status.toUpperCase().replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-royal-spice text-base">£{parseFloat(order.total).toFixed(2)}</td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => fetchOrderDetails(order.id)}
                                            className="h-10 px-6 bg-royal-gold/10 text-royal-spice rounded-xl hover:bg-royal-gold hover:text-royal-brown transition-all duration-300 text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Inspect
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4">
                <div className="text-[10px] font-black text-royal-brown/40 uppercase tracking-widest">
                    Showing <span className="text-royal-brown">{orders.from}</span> - <span className="text-royal-brown">{orders.to}</span> of <span className="text-royal-brown">{orders.total}</span> units
                </div>
                <div className="flex space-x-3">
                    {orders.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`h-12 min-w-[3rem] px-4 flex items-center justify-center rounded-2xl border-2 transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${link.active ? 'bg-royal-gold border-royal-gold text-royal-brown shadow-lg' : 'bg-white border-royal-brown/5 text-royal-brown hover:border-royal-gold'} ${!link.url && 'opacity-20 pointer-events-none'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-royal-brown/80 backdrop-blur-sm flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/10 relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-royal-gold"></div>
                        <div className="bg-royal-brown text-white p-10 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-royal-gold/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-black text-royal-gold/60 uppercase tracking-[0.4em] mb-3 block">Transaction ID</span>
                                <h2 className="text-4xl font-black font-playfair tracking-tighter text-royal-gold uppercase">{selectedOrder.order_number}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-royal-gold hover:text-royal-brown transition-all duration-500 border border-white/10 group relative z-10"
                            >
                                <i className="fas fa-times text-xl group-hover:rotate-90 transition-transform"></i>
                            </button>
                        </div>
                        <div className="p-12 max-h-[75vh] overflow-y-auto scrollbar-hide">
                            <div className="grid grid-cols-2 gap-12 mb-12 border-b border-royal-brown/5 pb-12">
                                <div>
                                    <h3 className="text-[10px] uppercase text-royal-brown/40 font-black tracking-[0.3em] mb-4 px-1">Customer Archetype</h3>
                                    <p className="text-xl font-black text-royal-brown font-playfair tracking-tight">{selectedOrder.customer?.name || 'Walk-in Guest'}</p>
                                    <p className="text-[10px] font-bold text-royal-brown/40 mt-1">{selectedOrder.customer?.email || 'OFFLINE-TERMINAL'}</p>

                                    <div className="flex flex-wrap gap-2 mt-6">
                                        <span className="text-[9px] font-black uppercase tracking-widest bg-royal-gold/10 text-royal-spice px-3 py-1.5 rounded-lg">{selectedOrder.order_type}</span>
                                        {selectedOrder.table && <span className="text-[9px] font-black uppercase tracking-widest bg-royal-brown text-royal-gold px-3 py-1.5 rounded-lg">Floor {selectedOrder.table.location} / T-{selectedOrder.table.table_number}</span>}
                                    </div>

                                    {/* Delivery Address Display */}
                                    {selectedOrder.order_type === 'delivery' && selectedOrder.delivery_address && (
                                        <div className="mt-6 bg-royal-cream/10 p-4 rounded-xl border border-royal-brown/5">
                                            <h4 className="text-[9px] font-black text-royal-brown/40 uppercase tracking-widest mb-2">Delivery Location</h4>
                                            <p className="text-sm font-bold text-royal-brown">{selectedOrder.delivery_address.address_line_1}</p>
                                            {selectedOrder.delivery_address.address_line_2 && <p className="text-sm text-royal-brown/60">{selectedOrder.delivery_address.address_line_2}</p>}
                                            <p className="text-sm text-royal-brown/60">{selectedOrder.delivery_address.city} {selectedOrder.delivery_address.postcode}</p>
                                            <p className="text-xs font-bold text-royal-spice mt-1">{selectedOrder.delivery_address.phone}</p>

                                            {selectedOrder.delivery_instructions && (
                                                <div className="mt-3 pt-3 border-t border-royal-brown/5">
                                                    <h5 className="text-[8px] font-black text-royal-brown/40 uppercase tracking-widest mb-1">Instructions</h5>
                                                    <p className="text-xs text-royal-brown/80 italic">"{selectedOrder.delivery_instructions}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-royal-cream/20 p-8 rounded-[2rem] border border-royal-brown/5 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[10px] uppercase text-royal-brown/40 font-black tracking-[0.3em] mb-4">Operational Insight</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-bold text-royal-brown/40 uppercase tracking-widest">Progress:</span>
                                                <span className="text-[9px] font-black text-royal-spice uppercase tracking-widest border-b border-royal-gold pb-0.5">{selectedOrder.status.replace(/_/g, ' ')}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-bold text-royal-brown/40 uppercase tracking-widest">Settlement:</span>
                                                <span className="text-[9px] font-black text-royal-brown uppercase tracking-widest">{selectedOrder.payment_status} ({selectedOrder.payment_method})</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-bold text-royal-brown/40 uppercase tracking-widest">Authorized By:</span>
                                                <span className="text-[9px] font-black text-royal-brown uppercase tracking-widest">{selectedOrder.staff?.name || 'SYSTEM'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Actions */}
                                    <div className="mt-6 pt-6 border-t border-royal-brown/10">
                                        <h4 className="text-[9px] font-black text-royal-brown/40 uppercase tracking-widest mb-3">Update Status</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedOrder.status === 'pending' && (
                                                <button onClick={() => updateStatus('preparing')} className="bg-royal-brown text-royal-gold text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:opacity-90">Start Preparing</button>
                                            )}
                                            {selectedOrder.status === 'preparing' && (
                                                <>
                                                    <button onClick={() => updateStatus('ready')} className="bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:opacity-90">Mark Ready</button>
                                                    {selectedOrder.order_type === 'delivery' && (
                                                        <button onClick={() => updateStatus('out_for_delivery')} className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:opacity-90">Out for Delivery</button>
                                                    )}
                                                </>
                                            )}
                                            {selectedOrder.status === 'ready' && selectedOrder.order_type === 'dine-in' && (
                                                <button onClick={() => updateStatus('served')} className="bg-royal-gold text-royal-brown text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:opacity-90">Mark Served</button>
                                            )}
                                            {selectedOrder.status === 'ready' && selectedOrder.order_type === 'delivery' && (
                                                <button onClick={() => updateStatus('out_for_delivery')} className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:opacity-90">Out for Delivery</button>
                                            )}
                                            {selectedOrder.status === 'out_for_delivery' && (
                                                <button onClick={() => updateStatus('delivered')} className="bg-green-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:opacity-90">Mark Delivered</button>
                                            )}
                                            {['pending', 'preparing'].includes(selectedOrder.status) && (
                                                <button onClick={() => updateStatus('cancelled')} className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:opacity-90 col-span-2">Cancel Order</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-[10px] font-black text-royal-brown/40 uppercase tracking-[0.4em] mb-8 text-center underline decoration-royal-gold/30 underline-offset-8">Culinary Items</h3>
                            <div className="space-y-6 mb-12">
                                {selectedOrder.order_items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-royal-cream/10 p-6 rounded-3xl border border-royal-brown/5 group hover:border-royal-gold/30 transition-all duration-300">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-royal-brown text-royal-gold rounded-2xl flex items-center justify-center font-black text-lg shadow-xl group-hover:scale-110 transition-transform">
                                                {item.quantity}x
                                            </div>
                                            <div className="ml-6">
                                                <p className="font-black text-royal-brown uppercase tracking-tight text-sm">{item.menu.name}</p>
                                                {item.special_instructions && (
                                                    <p className="text-[10px] text-royal-spice font-black tracking-widest uppercase mt-1 italic">Note: {item.special_instructions}</p>
                                                )}
                                            </div>
                                        </div>
                                        <p className="font-black text-royal-brown font-poppins text-base">£{parseFloat(item.subtotal).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-royal-brown p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-royal-gold/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="space-y-4 mb-4 relative z-10">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                        <span>Subtotal</span>
                                        <span className="text-white">£{parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                        <span>Federal Tax (10%)</span>
                                        <span className="text-white">£{parseFloat(selectedOrder.tax).toFixed(2)}</span>
                                    </div>
                                    {selectedOrder.delivery_fee > 0 && (
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                            <span>Delivery Fee</span>
                                            <span className="text-white">£{parseFloat(selectedOrder.delivery_fee).toFixed(2)}</span>
                                        </div>
                                    )}
                                    {parseFloat(selectedOrder.discount) > 0 && (
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                            <span>Royal Discount</span>
                                            <span>-£{parseFloat(selectedOrder.discount).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between text-4xl font-black text-royal-gold mt-10 pt-10 border-t border-white/5 relative z-10 font-playfair uppercase tracking-tighter">
                                    <span>Grand Total</span>
                                    <span>£{parseFloat(selectedOrder.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
