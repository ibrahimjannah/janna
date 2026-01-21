import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, tables }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
        table_number: '',
        capacity: 2,
        location: 'Main Hall',
    });

    const [editingTable, setEditingTable] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingTable) {
            put(route('admin.tables.update', editingTable.id), {
                onSuccess: () => {
                    setShowAddModal(false);
                    setEditingTable(null);
                    reset();
                }
            });
        } else {
            post(route('admin.tables.store'), {
                onSuccess: () => {
                    setShowAddModal(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (table) => {
        setEditingTable(table);
        setData({
            table_number: table.table_number,
            capacity: table.capacity,
            location: table.location,
        });
        setShowAddModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this table?')) {
            destroy(route('admin.tables.destroy', id));
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            occupied: 'bg-rose-100 text-rose-800 border-rose-200',
            reserved: 'bg-amber-100 text-amber-800 border-amber-200',
        };
        return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
    };

    return (
        <AdminLayout>
            <Head title="Table Management" />

            <div className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-royal-brown font-playfair tracking-tighter uppercase">Floor Command</h1>
                    <p className="text-royal-brown/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Architecting the physical dining experience</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTable(null);
                        reset();
                        setShowAddModal(true);
                    }}
                    className="h-14 bg-royal-brown text-royal-gold font-black px-10 rounded-2xl hover:bg-royal-gold hover:text-royal-brown transition-all duration-500 shadow-xl border border-white/5 text-[10px] uppercase tracking-[0.3em]"
                >
                    Inaugurate Table
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {tables.map((table) => (
                    <div key={table.id} className="bg-white rounded-[2.5rem] shadow-xl border border-royal-brown/5 overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 bg-royal-brown text-royal-gold rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl group-hover:bg-royal-gold group-hover:text-royal-brown transition-colors">
                                    {table.table_number}
                                </div>
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusColor(table.status)}`}>
                                    {table.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-royal-brown mb-2 font-playfair uppercase tracking-tight">Capacity: {table.capacity} Seats</h3>
                            <p className="text-[10px] font-black text-royal-brown/40 mb-8 flex items-center uppercase tracking-widest">
                                <i className="fas fa-map-marker-alt mr-3 text-royal-gold"></i>
                                {table.location}
                            </p>

                            <div className="pt-6 border-t border-royal-brown/5 flex space-x-4">
                                <button
                                    onClick={() => handleEdit(table)}
                                    className="flex-1 h-10 text-[10px] font-black text-royal-brown uppercase tracking-widest bg-royal-gold/10 hover:bg-royal-gold rounded-xl transition-all"
                                >
                                    Refine
                                </button>
                                <button
                                    onClick={() => handleDelete(table.id)}
                                    className="flex-1 h-10 text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-royal-brown/80 backdrop-blur-sm flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/10 relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-royal-gold"></div>
                        <div className="bg-royal-brown text-white p-10 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <h2 className="text-3xl font-black font-playfair tracking-tighter text-royal-gold uppercase relative z-10">
                                {editingTable ? 'Refine Table' : 'New Table'}
                            </h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-royal-gold hover:text-royal-brown transition-all duration-500 border border-white/10 group relative z-10"
                            >
                                <i className="fas fa-times text-lg group-hover:rotate-90 transition-transform"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-royal-brown/40 uppercase tracking-widest mb-3 px-1">Designator</label>
                                <input
                                    type="text"
                                    required
                                    value={data.table_number}
                                    onChange={e => setData('table_number', e.target.value)}
                                    className="w-full h-14 rounded-2xl border-royal-brown/5 bg-royal-cream/10 focus:border-royal-gold focus:ring-0 text-sm font-bold placeholder:text-royal-brown/20 transition-all"
                                    placeholder="e.g. T11"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-royal-brown/40 uppercase tracking-widest mb-3 px-1">Seat Volume</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={data.capacity}
                                    onChange={e => setData('capacity', e.target.value)}
                                    className="w-full h-14 rounded-2xl border-royal-brown/5 bg-royal-cream/10 focus:border-royal-gold focus:ring-0 text-sm font-bold transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-royal-brown/40 uppercase tracking-widest mb-3 px-1">Floor Sector</label>
                                <select
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    className="w-full h-14 rounded-2xl border-royal-brown/5 bg-royal-cream/10 focus:border-royal-gold focus:ring-0 text-sm font-bold transition-all"
                                >
                                    <option value="Main Hall">Main Hall</option>
                                    <option value="Window Side">Window Side</option>
                                    <option value="Private Room">Private Room</option>
                                    <option value="Outdoor">Outdoor</option>
                                </select>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-16 bg-royal-brown text-royal-gold font-black rounded-2xl hover:bg-royal-gold hover:text-royal-brown transition-all duration-500 shadow-2xl border border-white/5 text-[10px] uppercase tracking-[0.3em] disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : (editingTable ? 'Authorize Refinement' : 'Authorize Inauguration')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
