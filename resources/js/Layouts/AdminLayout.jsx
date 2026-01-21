import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-royal-cream/10 font-poppins selection:bg-royal-gold selection:text-royal-brown">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-royal-brown text-white transition-all duration-500 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-20`}>
                <div className="p-8 flex items-center justify-between">
                    <div className={`flex items-center space-x-4 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 invisible'}`}>
                        <div className="bg-royal-gold p-2 rounded-xl shadow-lg ring-4 ring-royal-gold/20">
                            <i className="fas fa-crown text-royal-brown text-xl"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-playfair font-black text-xl tracking-tighter text-royal-gold">INDIAN ROYAL</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-royal-cream/40">Admin Panel</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-royal-gold hover:text-white transition-colors p-2 bg-white/5 rounded-xl border border-white/10"
                    >
                        <i className={`fas ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} text-lg`}></i>
                    </button>
                </div>

                <nav className="flex-grow mt-10 overflow-y-auto px-4 scrollbar-hide">
                    <div className="space-y-8">
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-royal-cream/20 mb-6 px-4 ${!isSidebarOpen && 'hidden'}`}>General</p>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('admin.dashboard')} className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${route().current('admin.dashboard') ? 'bg-royal-gold text-royal-brown shadow-xl' : 'text-royal-cream/60 hover:bg-white/5 hover:text-royal-gold'}`}>
                                        <i className={`fas fa-th-large w-6 transition-transform group-hover:scale-110 ${route().current('admin.dashboard') ? 'text-royal-brown' : 'text-royal-gold'}`}></i>
                                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Dashboard</span>}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('admin.menu.index')} className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${route().current('admin.menu.index') ? 'bg-royal-gold text-royal-brown shadow-xl' : 'text-royal-cream/60 hover:bg-white/5 hover:text-royal-gold'}`}>
                                        <i className={`fas fa-utensils w-6 transition-transform group-hover:scale-110 ${route().current('admin.menu.index') ? 'text-royal-brown' : 'text-royal-gold'}`}></i>
                                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Menu Manager</span>}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('admin.tables.index')} className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${route().current('admin.tables.index') ? 'bg-royal-gold text-royal-brown shadow-xl' : 'text-royal-cream/60 hover:bg-white/5 hover:text-royal-gold'}`}>
                                        <i className={`fas fa-table-cells w-6 transition-transform group-hover:scale-110 ${route().current('admin.tables.index') ? 'text-royal-brown' : 'text-royal-gold'}`}></i>
                                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Tables</span>}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-royal-cream/20 mb-6 px-4 ${!isSidebarOpen && 'hidden'}`}>Operations</p>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('admin.orders.index')} className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${route().current('admin.orders.index') ? 'bg-royal-gold text-royal-brown shadow-xl' : 'text-royal-cream/60 hover:bg-white/5 hover:text-royal-gold'}`}>
                                        <i className={`fas fa-clipboard-list w-6 transition-transform group-hover:scale-110 ${route().current('admin.orders.index') ? 'text-royal-brown' : 'text-royal-gold'}`}></i>
                                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Live Orders</span>}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('admin.reservations')} className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${route().current('admin.reservations') ? 'bg-royal-gold text-royal-brown shadow-xl' : 'text-royal-cream/60 hover:bg-white/5 hover:text-royal-gold'}`}>
                                        <i className={`fas fa-calendar-check w-6 transition-transform group-hover:scale-110 ${route().current('admin.reservations') ? 'text-royal-brown' : 'text-royal-gold'}`}></i>
                                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Reservations</span>}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route('admin.customers.index')} className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${route().current('admin.customers.index') ? 'bg-royal-gold text-royal-brown shadow-xl' : 'text-royal-cream/60 hover:bg-white/5 hover:text-royal-gold'}`}>
                                        <i className={`fas fa-user-group w-6 transition-transform group-hover:scale-110 ${route().current('admin.customers.index') ? 'text-royal-brown' : 'text-royal-gold'}`}></i>
                                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Customer Base</span>}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-royal-cream/20 mb-6 px-4 ${!isSidebarOpen && 'hidden'}`}>Insights</p>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={route('admin.sales.index')} className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${route().current('admin.sales.index') ? 'bg-royal-gold text-royal-brown shadow-xl' : 'text-royal-cream/60 hover:bg-white/5 hover:text-royal-gold'}`}>
                                        <i className={`fas fa-chart-pie w-6 transition-transform group-hover:scale-110 ${route().current('admin.sales.index') ? 'text-royal-brown' : 'text-royal-gold'}`}></i>
                                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Analytics</span>}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="p-6 border-t border-white/5">
                    <Link href={route('admin.logout')} method="post" as="button" className={`w-full flex items-center p-4 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 text-royal-cream/40 group`}>
                        <i className="fas fa-power-off w-6 transition-transform group-hover:rotate-12"></i>
                        {isSidebarOpen && <span className="ml-4 font-bold text-sm tracking-tight">Log Out</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
                <header className="bg-white/80 backdrop-blur-md border-b border-royal-brown/5 h-24 px-10 flex justify-between items-center shrink-0">
                    <h2 className="text-2xl font-black text-royal-brown font-playfair tracking-tighter uppercase">
                        {route().current('admin.dashboard') ? 'Overview' : route().current().replace('admin.', '').replace('.index', '').replace('-', ' ')}
                    </h2>
                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col text-right">
                            <span className="text-xs font-black text-royal-brown uppercase tracking-widest">{auth.user.name}</span>
                            <span className="text-[10px] font-bold text-royal-brown/40 uppercase tracking-widest leading-none">Administrator</span>
                        </div>
                        <div className="h-14 w-14 bg-royal-brown p-1 rounded-2xl shadow-xl ring-4 ring-royal-gold/10">
                            <div className="h-full w-full bg-royal-gold rounded-xl flex items-center justify-center text-royal-brown font-black text-xl shadow-inner">
                                {auth.user.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
