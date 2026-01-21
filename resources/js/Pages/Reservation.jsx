import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Reservation({ auth }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user ? auth.user.name : '',
        email: auth.user ? auth.user.email : '',
        phone: '',
        date: '',
        time: '17:00',
        guests: '2',
        requests: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('reservation.store'), {
            onSuccess: () => {
                setShowSuccess(true);
                reset('phone', 'date', 'requests');
                setTimeout(() => setShowSuccess(false), 8000);
            },
        });
    };

    return (
        <MainLayout user={auth.user}>
            <Head title="Reservation" />

            <section id="reservation" className="py-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-center text-white mb-4 drop-shadow-md">Make a Reservation</h2>
                    <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12 text-lg">Secure your table for an unforgettable dining experience</p>

                    <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                        {/* Success Message Overlay */}
                        {showSuccess && (
                            <div className="absolute inset-0 z-10 bg-black/90 flex flex-col items-center justify-center p-8 text-center animate-fade-in backdrop-blur-xl">
                                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                                    <i className="fas fa-check text-4xl"></i>
                                </div>
                                <h3 className="text-3xl font-playfair font-bold text-white mb-2">Reservation Received!</h3>
                                <p className="text-gray-300 mb-8 max-w-md">Your table has been reserved successfully. We've sent a confirmation to your email. We look forward to serving you!</p>
                                <button
                                    onClick={() => setShowSuccess(false)}
                                    className="bg-royal-gold text-royal-brown font-bold py-3 px-10 rounded-full hover:bg-white hover:text-royal-brown transition duration-300 shadow-lg"
                                >
                                    Make Another Booking
                                </button>
                            </div>
                        )}

                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-5 py-4 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500 ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}
                                    placeholder="Enter your name"
                                    required
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-2 pl-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className={`w-full px-5 py-4 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500 ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                                    placeholder="Enter your email"
                                    required
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-2 pl-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className={`w-full px-5 py-4 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500 ${errors.phone ? 'border-red-500/50' : 'border-white/10'}`}
                                    placeholder="Enter your phone"
                                    required
                                />
                                {errors.phone && <p className="text-red-400 text-xs mt-2 pl-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Reservation Date</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className={`w-full px-5 py-4 bg-white/5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500 ${errors.date ? 'border-red-500/50' : 'border-white/10'}`}
                                    required
                                    style={{ colorScheme: 'dark' }}
                                />
                                {errors.date && <p className="text-red-400 text-xs mt-2 pl-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Reservation Time</label>
                                <select
                                    value={data.time}
                                    onChange={e => setData('time', e.target.value)}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent text-white"
                                    required
                                >
                                    <option value="17:00" className="bg-gray-900">5:00 PM</option>
                                    <option value="18:00" className="bg-gray-900">6:00 PM</option>
                                    <option value="19:00" className="bg-gray-900">7:00 PM</option>
                                    <option value="20:00" className="bg-gray-900">8:00 PM</option>
                                    <option value="21:00" className="bg-gray-900">9:00 PM</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">Number of Guests</label>
                                <select
                                    value={data.guests}
                                    onChange={e => setData('guests', e.target.value)}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent text-white"
                                    required
                                >
                                    <option value="1" className="bg-gray-900">1 Person</option>
                                    <option value="2" className="bg-gray-900">2 People</option>
                                    <option value="3" className="bg-gray-900">3 People</option>
                                    <option value="4" className="bg-gray-900">4 People</option>
                                    <option value="5" className="bg-gray-900">5 People</option>
                                    <option value="6" className="bg-gray-900">6 People</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-300 mb-2 font-medium">Special Requests</label>
                                <textarea
                                    value={data.requests}
                                    onChange={e => setData('requests', e.target.value)}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent text-white placeholder-gray-500"
                                    rows="4"
                                    placeholder="Any special requests or dietary requirements?"
                                ></textarea>
                                {errors.requests && <p className="text-red-400 text-xs mt-2 pl-1">{errors.requests}</p>}
                            </div>

                            <div className="md:col-span-2 text-center mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-royal-gold hover:bg-white text-royal-brown font-bold py-4 px-16 rounded-full text-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-2xl"
                                >
                                    {processing ? 'Processing...' : 'Book Your Table'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
