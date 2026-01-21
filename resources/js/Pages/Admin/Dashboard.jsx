import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Stats Cards */}
                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-royal-brown/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 left-0 w-2 h-full bg-royal-gold"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] text-royal-brown/40 uppercase font-black tracking-[0.2em] mb-2">Today's Orders</p>
                            <p className="text-4xl font-black text-royal-brown font-playfair tracking-tighter">12</p>
                        </div>
                        <div className="w-16 h-16 bg-royal-gold/10 rounded-2xl flex items-center justify-center group-hover:bg-royal-gold transition-colors duration-500">
                            <i className="fas fa-shopping-bag text-2xl text-royal-spice"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-royal-brown/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] text-royal-brown/40 uppercase font-black tracking-[0.2em] mb-2">Reservations</p>
                            <p className="text-4xl font-black text-royal-brown font-playfair tracking-tighter">4</p>
                        </div>
                        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500 transition-colors duration-500">
                            <i className="fas fa-calendar-alt text-2xl text-green-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-royal-brown/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] text-royal-brown/40 uppercase font-black tracking-[0.2em] mb-2">Total Sales</p>
                            <p className="text-4xl font-black text-royal-brown font-playfair tracking-tighter">£450.00</p>
                        </div>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-500">
                            <i className="fas fa-pound-sign text-2xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-royal-brown p-8 rounded-[2rem] shadow-2xl border border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 left-0 w-2 h-full bg-royal-gold"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mb-2">Live Tasks</p>
                            <p className="text-4xl font-black text-royal-gold font-playfair tracking-tighter">2</p>
                        </div>
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-royal-gold transition-colors duration-500">
                            <i className="fas fa-bolt text-2xl text-royal-gold group-hover:text-royal-brown"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-royal-brown/5">
                    <h3 className="text-xl font-black text-royal-brown mb-8 flex items-center font-playfair uppercase tracking-tighter">
                        <span className="w-10 h-10 bg-royal-gold/10 rounded-xl flex items-center justify-center mr-4">
                            <i className="fas fa-clock text-royal-spice text-sm"></i>
                        </span>
                        Stream Activity
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center p-5 bg-royal-cream/10 border border-royal-brown/5 rounded-3xl transition hover:border-royal-gold/30 group">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-5 ring-4 ring-green-500/10"></div>
                            <div className="flex-grow">
                                <p className="text-sm font-black text-royal-brown uppercase tracking-tight">New Reservation for Table 4</p>
                                <p className="text-[10px] font-black text-royal-brown/40 tracking-widest uppercase mt-1">2 minutes ago</p>
                            </div>
                            <i className="fas fa-chevron-right text-royal-gold opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                        <div className="flex items-center p-5 bg-royal-cream/10 border border-royal-brown/5 rounded-3xl transition hover:border-royal-gold/30 group">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-5 ring-4 ring-blue-500/10"></div>
                            <div className="flex-grow">
                                <p className="text-sm font-black text-royal-brown uppercase tracking-tight">Order #1234 settled</p>
                                <p className="text-[10px] font-black text-royal-brown/40 tracking-widest uppercase mt-1">15 minutes ago</p>
                            </div>
                            <i className="fas fa-chevron-right text-royal-gold opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-royal-brown p-12 rounded-[2.5rem] shadow-2xl text-center flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-royal-gold opacity-5 blur-[100px] rounded-full group-hover:opacity-10 transition-opacity"></div>
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <i className="fas fa-crown text-royal-gold text-5xl drop-shadow-2xl"></i>
                    </div>
                    <h3 className="text-3xl font-black text-royal-gold mb-4 font-playfair uppercase tracking-tighter">Royal Command</h3>
                    <p className="text-royal-cream/60 mb-10 max-w-sm text-sm font-bold leading-relaxed">Control the culinary experience from a single unified royal dashboard.</p>
                    <div className="flex space-x-6">
                        <button className="px-8 py-4 bg-royal-gold text-royal-brown text-xs font-black rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-xl uppercase tracking-widest">Manage Menu</button>
                        <button className="px-8 py-4 bg-white/5 border border-white/10 text-royal-cream text-xs font-black rounded-2xl hover:bg-white/10 hover:scale-105 transition-all uppercase tracking-widest">Settings</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
