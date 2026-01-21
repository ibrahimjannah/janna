import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

export default function MenuIndex({ auth, menus, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        category_id: '',
        name: '',
        description: '',
        price: '',
        spice_level: 0,
        is_signature: false,
    });

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setData({
            category_id: item.category_id,
            name: item.name,
            description: item.description,
            price: item.price,
            spice_level: item.spice_level,
            is_signature: !!item.is_signature,
        });
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingItem) {
            put(route('admin.menu.update', editingItem.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.menu.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const deleteItem = (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            destroy(route('admin.menu.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Menu Management" />

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-royal-brown text-white">
                    <h3 className="text-xl font-bold flex items-center">
                        <i className="fas fa-utensils mr-3 text-royal-gold"></i>
                        Food Menu Management
                    </h3>
                    <button
                        onClick={openCreateModal}
                        className="bg-royal-gold text-royal-brown font-bold px-4 py-2 rounded-lg hover:bg-white transition duration-300"
                    >
                        <i className="fas fa-plus mr-2"></i> Add New Item
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Dish Details</th>
                                <th className="px-6 py-4 font-bold">Category</th>
                                <th className="px-6 py-4 font-bold text-center">Spice</th>
                                <th className="px-6 py-4 font-bold">Price</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {menus.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-royal-brown">{item.name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                            {item.category?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            {[...Array(item.spice_level)].map((_, i) => (
                                                <i key={i} className="fas fa-pepper-hot text-red-500 text-[10px] mx-0.5"></i>
                                            ))}
                                            {item.spice_level === 0 && <span className="text-xs text-gray-300">Mild</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-royal-brown">
                                        £{parseFloat(item.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.is_signature ? (
                                            <span className="bg-royal-gold/20 text-royal-brown text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter">
                                                Signature
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 text-[10px] uppercase font-bold">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openEditModal(item)} className="text-blue-500 hover:text-blue-700 p-2"><i className="fas fa-edit"></i></button>
                                        <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700 p-2"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="bg-royal-brown p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editingItem ? 'Edit Dish' : 'Add New Dish'}</h3>
                            <button onClick={closeModal} className="text-white opacity-70 hover:opacity-100"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Dish Name</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-lg focus:ring-royal-gold focus:border-royal-gold"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full border-gray-300 rounded-lg focus:ring-royal-gold focus:border-royal-gold"
                                    value={data.category_id}
                                    onChange={e => setData('category_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="text-red-500 text-xs mt-1">{errors.category_id}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Price (£)</label>
                                    <input
                                        type="number" step="0.01"
                                        className="w-full border-gray-300 rounded-lg focus:ring-royal-gold focus:border-royal-gold"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        required
                                    />
                                    {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Spice Level (0-3)</label>
                                    <input
                                        type="number" min="0" max="3"
                                        className="w-full border-gray-300 rounded-lg focus:ring-royal-gold focus:border-royal-gold"
                                        value={data.spice_level}
                                        onChange={e => setData('spice_level', e.target.value)}
                                        required
                                    />
                                    {errors.spice_level && <div className="text-red-500 text-xs mt-1">{errors.spice_level}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border-gray-300 rounded-lg focus:ring-royal-gold focus:border-royal-gold"
                                    rows="3"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    required
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_signature"
                                    className="rounded border-gray-300 text-royal-gold focus:ring-royal-gold"
                                    checked={data.is_signature}
                                    onChange={e => setData('is_signature', e.target.checked)}
                                />
                                <label htmlFor="is_signature" className="ml-2 text-sm font-bold text-gray-700">Mark as Signature Dish</label>
                            </div>

                            <div className="pt-4 border-t flex space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-2 text-gray-600 font-bold border rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2 bg-royal-gold text-royal-brown font-bold rounded-lg hover:bg-royal-brown hover:text-white transition disabled:opacity-50"
                                >
                                    {editingItem ? 'Update Dish' : 'Add Dish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
