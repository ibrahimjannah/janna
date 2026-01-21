import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, stats, daily_sales, top_items, revenue_by_type, peakHours, period }) {

    // Function to handle period change
    const changePeriod = (newPeriod) => {
        router.get(route('admin.sales.index'), { period: newPeriod }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Sales Analytics" />

            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black text-royal-brown font-playfair tracking-tighter uppercase">Revenue Intelligence</h1>
                    <p className="text-royal-brown/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Deep dive into the financial fabric of Indian Royal Dine</p>
                </div>

                {/* Period Selector */}
                <div className="flex space-x-2 bg-white/50 p-1 rounded-xl backdrop-blur-sm shadow-sm border border-royal-brown/5 mt-4 md:mt-0">
                    {['day', 'week', 'month', 'year'].map((p) => (
                        <button
                            key={p}
                            onClick={() => changePeriod(p)}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${period === p
                                    ? 'bg-royal-brown text-royal-gold shadow-lg'
                                    : 'text-royal-brown/40 hover:text-royal-brown hover:bg-white'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-royal-brown/5 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-royal-gold/5 blur-3xl rounded-full"></div>
                    <p className="text-[10px] text-royal-brown/40 uppercase font-black tracking-[0.2em] mb-4">Gross Revenue</p>
                    <p className="text-4xl font-black text-royal-brown font-playfair tracking-tighter">£{parseFloat(stats.total_revenue).toLocaleString('en-GB', { minimumFractionDigits: 2 })}</p>
                    <div className="flex items-center mt-4">
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">↑ 12.4%</span>
                        <span className="text-[9px] font-bold text-royal-brown/20 uppercase tracking-widest ml-3">vs last quarter</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-royal-brown/5 relative group overflow-hidden">
                    <p className="text-[10px] text-royal-brown/40 uppercase font-black tracking-[0.2em] mb-4">Order Velocity</p>
                    <p className="text-4xl font-black text-royal-brown font-playfair tracking-tighter">{stats.total_orders}</p>
                    <p className="text-[10px] font-black text-sky-500 mt-4 uppercase tracking-[0.2em]">All-time transaction count</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-royal-brown/5 relative group overflow-hidden">
                    <p className="text-[10px] text-royal-brown/40 uppercase font-black tracking-[0.2em] mb-4">Average Ticket</p>
                    <p className="text-4xl font-black text-royal-brown font-playfair tracking-tighter">£{parseFloat(stats.avg_order_value).toFixed(2)}</p>
                    <p className="text-[10px] font-black text-royal-spice mt-4 uppercase tracking-[0.2em]">Per settled transaction</p>
                </div>
                <div className="bg-royal-brown p-8 rounded-[2rem] shadow-2xl relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-royal-gold/5 blur-3xl rounded-full"></div>
                    <p className="text-[10px] text-royal-gold/40 uppercase font-black tracking-[0.2em] mb-4">Active Capacity</p>
                    <p className="text-4xl font-black text-royal-gold font-playfair tracking-tighter">{stats.active_tables}</p>
                    <p className="text-[10px] font-black text-royal-cream/40 mt-4 uppercase tracking-[0.2em]">Currently occupied units</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Sales Chart */}
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-royal-brown/5">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-royal-brown font-playfair uppercase tracking-tighter">
                            {period === 'day' ? 'Hourly Performance' :
                                period === 'week' ? 'Weekly Trajectory' :
                                    period === 'month' ? 'Monthly Overview' : 'Annual Distribution'}
                        </h3>
                        <span className="text-[9px] font-black text-royal-brown/20 uppercase tracking-[0.3em]">
                            {daily_sales.length > 0 ? `${daily_sales.length} Data Points` : 'No Data'}
                        </span>
                    </div>

                    {daily_sales.length > 0 ? (
                        <div className="h-72 flex items-end justify-between gap-1.5 pb-2">
                            {daily_sales.map((item, index) => {
                                const maxRev = Math.max(...daily_sales.map(d => d.revenue), 1);
                                const height = (item.revenue / maxRev) * 100;
                                return (
                                    <div key={index} className="group relative flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full bg-royal-gold/20 group-hover:bg-royal-gold transition-all duration-500 rounded-t-xl"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <div className="invisible group-hover:visible absolute -top-12 left-1/2 -translate-x-1/2 bg-royal-brown text-royal-gold text-[10px] font-black px-3 py-2 rounded-xl shadow-2xl z-20 transition-all duration-300 transform scale-90 group-hover:scale-100 whitespace-nowrap">
                                            £{parseFloat(item.revenue).toFixed(2)}
                                        </div>
                                        <span className="text-[8px] font-black text-royal-brown/20 mt-4 rotate-45 origin-left tracking-tighter">
                                            {period === 'day' ? item.date.split(' ')[1] : item.date.split('-').slice(1).join('/')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-royal-brown/20 text-sm font-bold uppercase tracking-widest">
                            No Sales Data for this {period}
                        </div>
                    )}
                </div>

                {/* Top Selling Items */}
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-royal-brown/5">
                    <h3 className="text-xl font-black text-royal-brown mb-10 font-playfair uppercase tracking-tighter">Signature Velocity</h3>
                    <div className="space-y-8 h-72 overflow-y-auto pr-2 scrollbar-hide">
                        {top_items.length > 0 ? (
                            top_items.map((item, index) => (
                                <div key={index} className="group">
                                    <div className="flex items-center justify-between mb-3 px-1">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-royal-brown text-royal-gold rounded-xl flex items-center justify-center font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                                                {index + 1}
                                            </div>
                                            <span className="ml-4 font-black text-royal-brown uppercase tracking-tight text-sm">{item.menu_name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-black text-royal-spice text-sm">{item.total_quantity}</span>
                                            <span className="text-[9px] font-black text-royal-brown/20 uppercase tracking-widest ml-2">Sold</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-royal-cream/20 h-3 rounded-full overflow-hidden border border-royal-brown/5">
                                        <div
                                            className="bg-royal-gold h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${(item.total_quantity / top_items[0].total_quantity) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-royal-brown/20 text-sm font-bold uppercase tracking-widest">
                                No Item Sales recorded
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Revenue by Type */}
                <div className="bg-royal-brown p-12 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col justify-center">
                    <h3 className="text-xl font-black text-royal-gold mb-10 font-playfair uppercase tracking-tighter">Fiscal Distribution</h3>
                    <div className="space-y-8">
                        {revenue_by_type.length > 0 ? (
                            revenue_by_type.map((type, index) => {
                                const total = revenue_by_type.reduce((acc, curr) => acc + parseFloat(curr.revenue), 0);
                                const percentage = total > 0 ? (parseFloat(type.revenue) / total) * 100 : 0;
                                const colors = ['bg-royal-gold', 'bg-royal-spice', 'bg-royal-cream'];
                                return (
                                    <div key={index} className="group">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] mb-3 px-1">
                                            <span className="text-white/60">{type.order_type}</span>
                                            <span className="text-royal-gold">£{parseFloat(type.revenue).toFixed(2)} ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`${colors[index % 3] || 'bg-white'} h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-white/20 text-sm font-bold uppercase tracking-widest">
                                No Revenue Data
                            </div>
                        )}
                    </div>
                </div>

                {/* Peak Hours Analysis (NEW) */}
                <div className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-royal-brown/5 lg:col-span-2">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-royal-brown font-playfair uppercase tracking-tighter">Timeline Heatmap</h3>
                        <span className="text-[9px] font-black text-royal-brown/20 uppercase tracking-[0.3em]">
                            Peak Traffic Analysis
                        </span>
                    </div>

                    {peakHours && peakHours.length > 0 ? (
                        <div className="flex items-end justify-between gap-1 h-64">
                            {Array.from({ length: 24 }).map((_, hour) => {
                                const dataForHour = peakHours.find(h => parseInt(h.hour) === hour);
                                const orderCount = dataForHour ? dataForHour.order_count : 0;
                                const maxOrders = Math.max(...peakHours.map(h => h.order_count), 1);
                                const intensity = (orderCount / maxOrders);

                                return (
                                    <div key={hour} className="flex-1 flex flex-col items-center group relative">
                                        <div
                                            className={`w-full rounded-t-md transition-all duration-500 ${orderCount > 0 ? 'bg-royal-spice' : 'bg-gray-100'}`}
                                            style={{
                                                height: `${Math.max(intensity * 100, 5)}%`,
                                                opacity: Math.max(intensity, 0.2)
                                            }}
                                        ></div>

                                        {/* Hover Tooltip */}
                                        <div className="invisible group-hover:visible absolute -top-16 left-1/2 -translate-x-1/2 bg-royal-brown text-white p-2 rounded-lg z-20 w-max shadow-xl">
                                            <p className="text-[10px] font-bold uppercase tracking-wider">{hour}:00 - {hour}:59</p>
                                            <p className="text-royal-gold font-black text-sm">{orderCount} Orders</p>
                                            <p className="text-xs text-white/60">£{dataForHour ? parseFloat(dataForHour.total_sales).toFixed(2) : '0.00'}</p>
                                        </div>

                                        <span className="text-[8px] mt-2 text-royal-brown/40 font-bold hidden md:block group-hover:text-royal-brown">
                                            {hour}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-royal-brown/20 text-sm font-bold uppercase tracking-widest">
                            Not enough traffic data to generate heatmap
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-royal-brown/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-royal-spice rounded-full opacity-20"></div>
                                <span className="text-[10px] font-black uppercase text-royal-brown/40">Quiet</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-royal-spice rounded-full opacity-100"></div>
                                <span className="text-[10px] font-black uppercase text-royal-brown/40">Peak</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-right font-bold text-royal-brown/40 uppercase tracking-widest">
                            Based on {period}ly aggregated timestamps
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
