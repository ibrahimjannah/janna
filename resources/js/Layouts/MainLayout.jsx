import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ChatWidget from '@/Components/ChatWidget';

export default function MainLayout({ children }) {
    const { auth, cartCount, flash } = usePage().props;
    const user = auth.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    // Reset flash visibility when a new message arrives
    React.useEffect(() => {
        if (flash.success || flash.error || flash.info || flash.warning) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <div className="font-poppins min-h-screen flex flex-col relative text-white selection:bg-royal-gold selection:text-royal-brown">
            {/* Flash Messages */}
            {(flash.success || flash.error || flash.info || flash.warning) && showFlash && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-bounce-in">
                    <div className={`
                        flex items-center justify-between p-4 rounded-2xl shadow-2xl backdrop-blur-xl border
                        ${flash.success ? 'bg-green-500/20 border-green-500/50 text-green-400' : ''}
                        ${flash.error ? 'bg-red-500/20 border-red-500/50 text-red-400' : ''}
                        ${flash.info ? 'bg-royal-gold/20 border-royal-gold/50 text-royal-gold' : ''}
                        ${flash.warning ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : ''}
                    `}>
                        <div className="flex items-center gap-3">
                            <i className={`fas ${flash.success ? 'fa-check-circle' :
                                    flash.error ? 'fa-exclamation-circle' :
                                        flash.info ? 'fa-info-circle' : 'fa-exclamation-triangle'
                                }`}></i>
                            <p className="font-medium text-sm">{flash.success || flash.error || flash.info || flash.warning}</p>
                        </div>
                        <button onClick={() => setShowFlash(false)} className="opacity-50 hover:opacity-100 transition">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-[-1]">
                <img
                    src="/images/hero.png"
                    alt="Background"
                    className="w-full h-full object-cover brightness-[0.25]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-royal-brown/20 to-black/30"></div>
            </div>

            <ChatWidget />

            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 transition-all duration-300 bg-black/10 backdrop-blur-md border-b border-white/10 shadow-xl">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-4">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center group">
                            <i className="fas fa-crown text-royal-gold text-2xl mr-2 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] transition-all"></i>
                            <Link href="/" className="text-2xl font-playfair font-bold tracking-wider text-white group-hover:text-royal-gold transition-colors">INDIAN ROYAL DINE</Link>
                        </div>

                        {/* Mobile Right Section: Cart + Hamburger */}
                        <div className="flex items-center lg:hidden gap-5">
                            <Link href={route('cart.index')} className="relative text-white hover:text-royal-gold transition duration-300">
                                <i className="fas fa-shopping-cart text-xl"></i>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-royal-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-black/50 shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-white focus:outline-none hover:text-royal-gold transition p-1"
                            >
                                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                            </button>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link href="/" className="hover:text-royal-gold transition duration-300 font-medium tracking-wide">Home</Link>
                            <Link href={route('menu')} className="hover:text-royal-gold transition duration-300 font-medium tracking-wide">Menu</Link>
                            <Link href={route('reservation')} className="hover:text-royal-gold transition duration-300 font-medium tracking-wide">Reservation</Link>
                            <Link href={route('contact')} className="hover:text-royal-gold transition duration-300 font-medium tracking-wide">Contact</Link>

                            {user ? (
                                <>
                                    <Link href={route('dashboard')} className="hover:text-royal-gold transition duration-300 font-medium">My Account</Link>
                                    <Link href={route('favorites.index')} className="hover:text-royal-gold transition duration-300 font-medium">Favorites</Link>
                                    <Link href={route('logout')} method="post" as="button" className="text-royal-brown bg-royal-gold rounded-full px-6 py-2 hover:bg-white hover:text-royal-brown transition duration-300 font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">Logout</Link>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="hover:text-royal-gold transition duration-300 font-medium">Login</Link>
                                    <Link href={route('register')} className="bg-white/10 text-white border border-royal-gold/50 rounded-full px-6 py-2 hover:bg-royal-gold hover:text-royal-brown transition duration-300 font-bold backdrop-blur-sm">Sign Up</Link>
                                </>
                            )}

                            {/* Desktop Cart Icon */}
                            <Link href={route('cart.index')} className="relative text-white hover:text-royal-gold transition duration-300 flex items-center pl-4 border-l border-white/20">
                                <i className="fas fa-shopping-cart text-2xl"></i>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-3 bg-royal-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-black/30 shadow-md">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`lg:hidden absolute top-full left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
                    <div className="flex flex-col px-4 space-y-4">
                        <Link href="/" className="hover:text-royal-gold py-2 border-b border-white/10 text-lg">Home</Link>
                        <Link href={route('menu')} className="hover:text-royal-gold py-2 border-b border-white/10 text-lg">Menu</Link>
                        <Link href={route('reservation')} className="hover:text-royal-gold py-2 border-b border-white/10 text-lg">Reservation</Link>
                        <Link href={route('contact')} className="hover:text-royal-gold py-2 border-b border-white/10 text-lg">Contact</Link>

                        {user ? (
                            <>
                                <Link href={route('dashboard')} className="hover:text-royal-gold py-2 border-b border-white/10">My Account</Link>
                                <Link href={route('favorites.index')} className="hover:text-royal-gold py-2 border-b border-white/10">Favorites</Link>
                                <Link href={route('logout')} method="post" as="button" className="text-left text-royal-gold py-2 font-bold">Logout</Link>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 mt-2">
                                <Link href={route('login')} className="text-center py-2 border border-royal-gold rounded-lg hover:bg-royal-gold/10 text-royal-gold">Login</Link>
                                <Link href={route('register')} className="text-center py-2 bg-royal-gold text-royal-brown rounded-lg font-bold hover:bg-white transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 text-white py-12 mt-auto">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <i className="fas fa-crown text-royal-gold text-2xl mr-2"></i>
                                <h3 className="text-2xl font-playfair font-bold">INDIAN ROYAL DINE</h3>
                            </div>
                            <p className="text-gray-300 mb-4">Experience the royal flavors of India in the heart of London.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-royal-gold transition-colors"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-gray-400 hover:text-royal-gold transition-colors"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="text-gray-400 hover:text-royal-gold transition-colors"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-gray-400 hover:text-royal-gold transition-colors"><i className="fab fa-youtube"></i></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold mb-4 text-royal-gold">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link href="/" className="text-gray-300 hover:text-royal-gold transition duration-300">Home</Link></li>
                                <li><Link href={route('menu')} className="text-gray-300 hover:text-royal-gold transition duration-300">Menu</Link></li>
                                <li><Link href={route('reservation')} className="text-gray-300 hover:text-royal-gold transition duration-300">Reservation</Link></li>
                                <li><Link href={route('contact')} className="text-gray-300 hover:text-royal-gold transition duration-300">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold mb-4 text-royal-gold">Opening Hours</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li className="flex justify-between"><span>Monday - Friday</span> <span>5:00 PM - 11:00 PM</span></li>
                                <li className="flex justify-between"><span>Saturday</span> <span>12:00 PM - 11:30 PM</span></li>
                                <li className="flex justify-between"><span>Sunday</span> <span>12:00 PM - 10:00 PM</span></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold mb-4 text-royal-gold">Contact Info</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-start">
                                    <i className="fas fa-map-marker-alt mt-1 mr-3 text-royal-gold"></i>
                                    <span>123 Spice Street, London, UK</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-phone-alt mr-3 text-royal-gold"></i>
                                    <span>+44 20 1234 5678</span>
                                </li>
                                <li className="flex items-center">
                                    <i className="fas fa-envelope mr-3 text-royal-gold"></i>
                                    <span>info@indianroyaldine.co.uk</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2023 INDIAN ROYAL DINE. All rights reserved. | Designed with <i className="fas fa-heart text-royal-gold"></i> for authentic Indian cuisine</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
