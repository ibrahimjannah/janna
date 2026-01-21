import POSLayout from '@/Layouts/POSLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function POSTables({ auth, tables: initialTables }) {
    const [tables, setTables] = useState(initialTables || []);
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        // Auto-refresh table status every 15 seconds
        const interval = setInterval(() => {
            fetch(route('pos.tables.status'))
                .then(res => res.json())
                .then(data => setTables(data))
                .catch(err => console.error('Error fetching tables:', err));
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            available: 'bg-green-600',
            occupied: 'bg-royal-brown',
            reserved: 'bg-royal-spice'
        };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusIcon = (status) => {
        const icons = {
            available: '✓',
            occupied: '👥',
            reserved: '🔒'
        };
        return icons[status] || '?';
    };

    const handleClearTable = async (tableId) => {
        if (!confirm('Are you sure you want to clear this table?')) return;

        try {
            const response = await fetch(route('pos.tables.clear', tableId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            const result = await response.json();

            if (result.success) {
                // Refresh tables
                const updatedTables = await fetch(route('pos.tables.status')).then(r => r.json());
                setTables(updatedTables);
                alert('Table cleared successfully');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to clear table');
        }
    };

    const handleReserveTable = async (tableId) => {
        try {
            const response = await fetch(route('pos.tables.reserve', tableId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            const result = await response.json();

            if (result.success) {
                const updatedTables = await fetch(route('pos.tables.status')).then(r => r.json());
                setTables(updatedTables);
                alert('Table reserved successfully');
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to reserve table');
        }
    };

    const groupedTables = tables.reduce((acc, table) => {
        const location = table.location || 'Other';
        if (!acc[location]) acc[location] = [];
        acc[location].push(table);
        return acc;
    }, {});

    return (
        <POSLayout user={auth.user}>
            <Head title="Table Management" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-playfair font-bold text-royal-brown tracking-wider uppercase">Table Management</h1>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-600 rounded shadow-sm"></div>
                                <span className="text-xs font-bold text-royal-brown/60 uppercase tracking-widest">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-royal-brown rounded shadow-sm"></div>
                                <span className="text-xs font-bold text-royal-brown/60 uppercase tracking-widest">Occupied</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-royal-spice rounded shadow-sm"></div>
                                <span className="text-xs font-bold text-royal-brown/60 uppercase tracking-widest">Reserved</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tables by Location */}
                {Object.entries(groupedTables).map(([location, locationTables]) => (
                    <div key={location} className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-playfair font-bold text-royal-brown mb-6 border-b border-royal-brown/10 pb-2">{location}</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {locationTables.map(table => (
                                <div
                                    key={table.id}
                                    onClick={() => setSelectedTable(table)}
                                    className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${selectedTable?.id === table.id ? 'ring-4 ring-royal-gold ring-offset-2' : 'border border-royal-brown/5'
                                        }`}
                                    style={{
                                        background: table.status === 'available'
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : table.status === 'occupied'
                                                ? 'linear-gradient(135deg, #5D4037 0%, #3e2723 100%)'
                                                : 'linear-gradient(135deg, #FF8C00 0%, #E65100 100%)'
                                    }}
                                >
                                    <div className="text-white">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-4xl font-playfair font-black">{table.table_number}</span>
                                            <span className="text-2xl drop-shadow-md">{getStatusIcon(table.status)}</span>
                                        </div>
                                        <div className="text-xs font-bold uppercase tracking-widest opacity-90">
                                            <p>Capacity: {table.capacity}</p>
                                            <p className="mt-1">{table.status}</p>
                                        </div>

                                        {table.current_order && (
                                            <div className="mt-3 pt-3 border-t border-white/30">
                                                <p className="text-xs font-semibold">
                                                    Order: {table.current_order.order_number}
                                                </p>
                                                <p className="text-xs">
                                                    £{table.current_order.total?.toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Selected Table Details */}
                {selectedTable && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Table {selectedTable.table_number} Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Information</h3>
                                <div className="space-y-2 text-gray-600">
                                    <p><span className="font-medium">Location:</span> {selectedTable.location}</p>
                                    <p><span className="font-medium">Capacity:</span> {selectedTable.capacity} people</p>
                                    <p>
                                        <span className="font-medium">Status:</span>{' '}
                                        <span className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(selectedTable.status)}`}>
                                            {selectedTable.status}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {selectedTable.current_order && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Current Order</h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p><span className="font-medium">Order #:</span> {selectedTable.current_order.order_number}</p>
                                        <p><span className="font-medium">Total:</span> £{selectedTable.current_order.total?.toFixed(2)}</p>
                                        <p><span className="font-medium">Status:</span> {selectedTable.current_order.status}</p>
                                    </div>
                                </div>
                            )}

                            <div className="md:col-span-2 flex gap-3">
                                {selectedTable.status === 'available' && (
                                    <>
                                        <button
                                            onClick={() => handleReserveTable(selectedTable.id)}
                                            className="flex-1 bg-royal-spice text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-md"
                                        >
                                            Reserve Table
                                        </button>
                                        <button
                                            onClick={() => router.visit(route('pos.orders.index'))}
                                            className="flex-1 bg-royal-gold text-royal-brown py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-md"
                                        >
                                            New Order
                                        </button>
                                    </>
                                )}

                                {selectedTable.status === 'occupied' && (
                                    <>
                                        <button
                                            onClick={() => router.visit(route('pos.orders.show', selectedTable.current_order.id))}
                                            className="flex-1 bg-royal-brown text-royal-cream py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
                                        >
                                            View Order
                                        </button>
                                        <button
                                            onClick={() => handleClearTable(selectedTable.id)}
                                            className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-green-700 transition-all shadow-md"
                                        >
                                            Clear Table
                                        </button>
                                    </>
                                )}

                                {selectedTable.status === 'reserved' && (
                                    <button
                                        onClick={() => handleClearTable(selectedTable.id)}
                                        className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-green-700 transition-all shadow-md"
                                    >
                                        Clear Reservation
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </POSLayout>
    );
}
