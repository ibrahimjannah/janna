import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function POSLayout({ children, user }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: route('pos.dashboard'), icon: '📊' },
        { name: 'Orders', href: route('pos.orders.index'), icon: '🛒' },
        { name: 'Tables', href: route('pos.tables.index'), icon: '🪑' },
        { name: 'Kitchen', href: route('pos.kitchen.index'), icon: '👨‍🍳' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-royal-brown text-white transition-all duration-300 flex flex-col border-r border-royal-gold/20`}>
                <div className="p-4 flex items-center justify-between border-b border-royal-gold/10">
                    {sidebarOpen && <h1 className="text-xl font-playfair font-bold text-royal-gold tracking-wider uppercase">POS Terminal</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-royal-gold/20 text-royal-gold"
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-4">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${route().current(item.href.split('/').pop())
                                    ? 'bg-royal-gold text-royal-brown shadow-lg'
                                    : 'hover:bg-royal-gold/10 text-royal-cream/80 hover:text-royal-gold'
                                }`}
                        >
                            <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                            {sidebarOpen && <span className="ml-3 font-poppins font-semibold uppercase tracking-widest text-xs">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-royal-gold/10 bg-black/10">
                    {sidebarOpen && (
                        <div className="mb-4 px-2">
                            <p className="text-xs font-bold text-royal-gold uppercase tracking-tighter">Logged in as</p>
                            <p className="text-sm font-poppins font-medium text-royal-cream">{user?.name}</p>
                            <p className="text-[10px] text-royal-gold/60 font-bold uppercase tracking-widest mt-1">{user?.staffRole?.role}</p>
                        </div>
                    )}
                    <Link
                        href={route('pos.logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center px-4 py-3 bg-royal-gold text-royal-brown rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-amber-600 transition-colors shadow-md"
                    >
                        <span className="text-lg">🚪</span>
                        {sidebarOpen && <span className="ml-2">Logout</span>}
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Indian Royal Dine - POS
                    </h2>
                    <div className="text-sm text-gray-600">
                        {new Date().toLocaleString()}
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
