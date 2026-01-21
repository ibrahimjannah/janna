import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Contact({ auth, subject, flash }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: auth.user ? auth.user.name : '',
        email: auth.user ? auth.user.email : '',
        category: 'General Inquiry',
        guest_count: '',
        event_type: 'Dinner',
        subject: subject || '',
        message: '',
    });

    useEffect(() => {
        if (recentlySuccessful) {
            reset('message', 'subject', 'guest_count', 'event_type');
        }
    }, [recentlySuccessful]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.submit'), {
            preserveScroll: true,
        });
    };

    return (
        <MainLayout user={auth.user}>
            <Head title="Contact Us" />

            <section id="contact" className="py-16 min-h-screen">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-6xl font-playfair font-bold text-center text-white mb-4 drop-shadow-md">Contact Us</h2>
                    <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12 text-lg">We'd love to hear from you. Reach out to us anytime!</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-3xl font-playfair font-bold text-white mb-8 border-b border-white/10 pb-4">Get In Touch</h3>
                            <div className="space-y-8">
                                <div className="flex items-start group">
                                    <div className="w-12 h-12 rounded-full bg-royal-gold/20 flex items-center justify-center mr-5 group-hover:bg-royal-gold/40 transition">
                                        <i className="fas fa-map-marker-alt text-royal-gold text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl text-white mb-1">Address</h4>
                                        <p className="text-gray-300 leading-relaxed">123 Spice Street, London, UK</p>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="w-12 h-12 rounded-full bg-royal-gold/20 flex items-center justify-center mr-5 group-hover:bg-royal-gold/40 transition">
                                        <i className="fas fa-phone-alt text-royal-gold text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl text-white mb-1">Phone</h4>
                                        <p className="text-gray-300 leading-relaxed">+44 20 1234 5678</p>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="w-12 h-12 rounded-full bg-royal-gold/20 flex items-center justify-center mr-5 group-hover:bg-royal-gold/40 transition">
                                        <i className="fas fa-envelope text-royal-gold text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl text-white mb-1">Email</h4>
                                        <p className="text-gray-300 leading-relaxed">info@indianroyaldine.co.uk</p>
                                    </div>
                                </div>

                                <div className="flex items-start group">
                                    <div className="w-12 h-12 rounded-full bg-royal-gold/20 flex items-center justify-center mr-5 group-hover:bg-royal-gold/40 transition">
                                        <i className="fas fa-clock text-royal-gold text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl text-white mb-1">Opening Hours</h4>
                                        <p className="text-gray-300 leading-relaxed">Monday - Sunday: 5:00 PM - 11:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-playfair font-bold text-white mt-12 mb-6">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-white/5 hover:bg-royal-gold hover:text-royal-brown text-white p-4 rounded-full transition duration-300 border border-white/10 hover:border-transparent shadow-lg text-lg w-12 h-12 flex items-center justify-center">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="bg-white/5 hover:bg-royal-gold hover:text-royal-brown text-white p-4 rounded-full transition duration-300 border border-white/10 hover:border-transparent shadow-lg text-lg w-12 h-12 flex items-center justify-center">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="bg-white/5 hover:bg-royal-gold hover:text-royal-brown text-white p-4 rounded-full transition duration-300 border border-white/10 hover:border-transparent shadow-lg text-lg w-12 h-12 flex items-center justify-center">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="bg-white/5 hover:bg-royal-gold hover:text-royal-brown text-white p-4 rounded-full transition duration-300 border border-white/10 hover:border-transparent shadow-lg text-lg w-12 h-12 flex items-center justify-center">
                                    <i className="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                            <h3 className="text-2xl font-playfair font-bold text-white mb-6">Send Message</h3>

                            {flash?.success && (
                                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-xl animate-fade-in">
                                    <i className="fas fa-check-circle mr-2"></i> {flash.success}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className={`w-full px-5 py-4 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500`}
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                        />
                                        {errors.name && <div className="text-red-400 text-xs mt-1 ml-1">{errors.name}</div>}
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            className={`w-full px-5 py-4 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500`}
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                        {errors.email && <div className="text-red-400 text-xs mt-1 ml-1">{errors.email}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2 ml-1">Inquiry Type</label>
                                    <select
                                        className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold items-center transition text-white"
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                    >
                                        <option value="General Inquiry" className="bg-royal-brown">General Inquiry</option>
                                        <option value="Party Catering" className="bg-royal-brown">Party Catering</option>
                                        <option value="Feedback" className="bg-royal-brown">Feedback</option>
                                    </select>
                                </div>

                                {data.category === 'Party Catering' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2 ml-1">Expected Guests</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 50"
                                                className={`w-full px-5 py-4 bg-white/5 border ${errors.guest_count ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold transition text-white`}
                                                value={data.guest_count}
                                                onChange={e => setData('guest_count', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2 ml-1">Event Type</label>
                                            <select
                                                className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold text-white"
                                                value={data.event_type}
                                                onChange={e => setData('event_type', e.target.value)}
                                            >
                                                <option value="Breakfast" className="bg-royal-brown">Breakfast</option>
                                                <option value="Lunch" className="bg-royal-brown">Lunch</option>
                                                <option value="Dinner" className="bg-royal-brown">Dinner</option>
                                                <option value="Evening Reception" className="bg-royal-brown">Evening Reception</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className={`w-full px-5 py-4 bg-white/5 border ${errors.subject ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500`}
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                    />
                                    {errors.subject && <div className="text-red-400 text-xs mt-1 ml-1">{errors.subject}</div>}
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Your Message..."
                                        rows="4"
                                        className={`w-full px-5 py-4 bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-gold focus:border-transparent transition text-white placeholder-gray-500`}
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                    ></textarea>
                                    {errors.message && <div className="text-red-400 text-xs mt-1 ml-1">{errors.message}</div>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-royal-gold hover:bg-white text-royal-brown font-bold py-4 rounded-xl transition duration-300 shadow-lg mt-2 flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {processing ? (
                                        <i className="fas fa-spinner animate-spin"></i>
                                    ) : (
                                        <>
                                            {data.category === 'Party Catering' ? 'Send Catering Inquiry' : 'Send Message'}
                                            <i className="fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
