import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Reservations({ auth, reservations }) {
    return (
        <AdminLayout>
            <Head title="Reservations Management" />

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-royal-brown">Table Reservations</h3>
                    <div className="flex space-x-2">
                        <span className="bg-royal-gold/20 text-royal-brown px-3 py-1 rounded-full text-xs font-bold">
                            Total: {reservations.length}
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Customer</th>
                                <th className="px-6 py-4 font-bold">Date & Time</th>
                                <th className="px-6 py-4 font-bold">Guests</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Requests</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-400 font-medium">
                                        No reservations found.
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-gray-50 transition duration-200">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-royal-brown">{res.name}</div>
                                            <div className="text-xs text-gray-500">{res.email}</div>
                                            <div className="text-xs text-gray-500">{res.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium">{res.date}</div>
                                            <div className="text-xs text-gray-500">{res.time}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                                                {res.guests} People
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${res.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-xs text-gray-600 truncate" title={res.requests}>
                                                {res.requests || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-royal-gold hover:text-royal-brown transition p-2">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-600 transition p-2">
                                                <i className="fas fa-trash"></i>
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
