import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <MainLayout user={auth.user}>
            <Head title="My Account" />

            <section className="py-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <i className="fas fa-crown text-royal-gold text-4xl mb-4 drop-shadow-md"></i>
                            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-2">My Account</h2>
                            <p className="text-gray-300 text-lg">Welcome back, <span className="text-royal-gold font-semibold">{auth.user.name}</span></p>
                            <p className="text-sm text-gray-400 mt-1">@{auth.user.username}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {/* Account Details Card */}
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl hover:bg-black/50 transition duration-300">
                                <h3 className="text-2xl font-playfair font-bold text-white mb-6 flex items-center border-b border-white/10 pb-4">
                                    <i className="fas fa-user-circle mr-3 text-royal-gold"></i>
                                    Profile Details
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-medium text-royal-gold uppercase tracking-widest mb-1">Full Name</label>
                                        <p className="text-xl text-white font-medium">{auth.user.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-royal-gold uppercase tracking-widest mb-1">Email</label>
                                        <p className="text-xl text-white font-medium">{auth.user.email}</p>
                                    </div>
                                    <div className="pt-2">
                                        <Link href={route('profile.edit')} className="inline-block px-8 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-royal-gold hover:text-royal-brown hover:border-transparent transition duration-300 shadow-md">
                                            Edit Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions / Status */}
                            <div className="bg-gradient-to-br from-royal-brown/60 to-black/60 backdrop-blur-md border border-royal-gold/20 p-8 rounded-3xl shadow-xl text-white">
                                <h3 className="text-2xl font-playfair font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                                    <i className="fas fa-star mr-3 text-royal-gold"></i>
                                    Loyalty Status
                                </h3>
                                <div className="text-center py-6">
                                    <p className="text-royal-gold text-6xl font-bold mb-2 drop-shadow-md">0</p>
                                    <p className="text-gray-300 uppercase tracking-widest text-sm font-semibold">Reward Points</p>
                                </div>
                                <div className="mt-4 pt-6 border-t border-white/10 text-center">
                                    <p className="text-sm text-gray-400 mb-5">Start ordering to earn points!</p>
                                    <Link href={route('menu')} className="inline-block px-8 py-3 bg-royal-gold text-royal-brown font-bold rounded-full hover:bg-white transition duration-300 shadow-lg">
                                        Order Now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent History Placeholders */}
                        <div className="grid grid-cols-1 gap-8">
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Recent Orders</h3>
                                <p className="text-gray-400 italic py-8 text-center bg-white/5 rounded-xl border border-white/5">No recent orders found.</p>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">My Reservations</h3>
                                <p className="text-gray-400 italic py-8 text-center bg-white/5 rounded-xl border border-white/5">No upcoming reservations.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
