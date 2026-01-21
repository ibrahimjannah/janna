import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

export default function CustomerIndex({ auth, customers }) {
    const deleteCustomer = (id) => {
        if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            router.delete(route('admin.customers.destroy', id), {
                onSuccess: () => alert('Customer deleted successfully'),
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Customer Management" />

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-royal-brown text-white">
                    <h3 className="text-xl font-bold flex items-center">
                        <i className="fas fa-users mr-3 text-royal-gold"></i>
                        Customer Management
                    </h3>
                    <div className="flex space-x-2">
                        <span className="bg-royal-gold/20 text-white px-3 py-1 rounded-full text-xs font-bold ring-1 ring-royal-gold">
                            Total Registered: {customers.length}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">User</th>
                                <th className="px-6 py-4 font-bold">Email</th>
                                <th className="px-6 py-4 font-bold">Username</th>
                                <th className="px-6 py-4 font-bold">Joined Date</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">
                                        No registered customers yet.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 bg-royal-gold/10 text-royal-brown rounded-full flex items-center justify-center font-bold mr-3 border border-royal-gold/20">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-royal-brown">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono">
                                                @{user.username || 'n/a'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteCustomer(user.id)}
                                                className="text-red-400 hover:text-red-600 transition p-2"
                                                title="Delete Customer"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
