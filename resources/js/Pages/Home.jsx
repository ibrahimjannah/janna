import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Home({ auth, signatureDishes }) {
    return (
        <MainLayout user={auth.user}>
            <Head title="Authentic Indian Cuisine" />

            {/* Hero Section */}
            <section id="home" className="relative min-h-[90vh] flex items-center">
                {/* Gradient Overlay for Hero to make text pop against global background */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-0"></div>

                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center py-20 relative z-10">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-8 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                        Experience Royal <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-gold to-yellow-200">Indian Flavors</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 font-light tracking-wide drop-shadow-md">
                        Authentic spices, traditional recipes, and royal hospitality in the heart of London
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href={route('menu')} className="bg-royal-gold/90 hover:bg-royal-gold text-royal-brown font-bold py-4 px-12 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)] backdrop-blur-sm">
                            View Our Menu
                        </Link>
                        <Link href={route('reservation')} className="bg-white/5 border border-white/30 text-white hover:bg-white/10 font-bold py-4 px-12 rounded-full text-lg transition duration-300 backdrop-blur-md shadow-lg">
                            Book a Table
                        </Link>
                    </div>
                </div>
            </section>

            {/* Our Story / Royal Heritage */}
            <section className="py-24 relative overflow-hidden">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-royal-gold/10 rounded-3xl blur-2xl group-hover:bg-royal-gold/20 transition duration-700"></div>
                            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-3xl overflow-hidden shadow-2xl">
                                <img src="/images/hero.png" alt="Royal Heritage" className="w-full h-[500px] object-cover rounded-2xl grayscale-[20%] group-hover:grayscale-0 transition duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-10 left-10">
                                    <p className="text-royal-gold font-playfair text-3xl italic">"A Legacy of Spices"</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="inline-block px-4 py-1 bg-royal-gold/10 border border-royal-gold/30 rounded-full text-royal-gold text-sm font-bold tracking-widest uppercase">
                                Our Heritage
                            </div>
                            <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white leading-tight">
                                Inspired by the <span className="text-royal-gold">Majesty</span> of Ancient India
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed font-light">
                                Just as the royal rowing teams of history demonstrated unparalleled precision and synchronization, our culinary brigade operates with the same dedication to detail. At Indian Royal Dine, we believe that every dish tells a story of heritage—one that began in the imperial kitchens of the Maharajas and continues in the heart of London.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div>
                                    <h4 className="text-royal-gold font-bold text-3xl mb-1">Authentic</h4>
                                    <p className="text-gray-400 text-sm">Time-honored recipes passed down through generations.</p>
                                </div>
                                <div>
                                    <h4 className="text-royal-gold font-bold text-3xl mb-1">Artisanal</h4>
                                    <p className="text-gray-400 text-sm">Hand-ground spices and organic ingredients only.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Food Gallery / Signature Dishes */}
            <section className="py-20 relative">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4"><span className="border-b-4 border-royal-gold">Our Signature Dishes</span></h2>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg mt-6">Handcrafted with authentic spices and traditional techniques</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        {signatureDishes.map((dish) => (
                            <div key={dish.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] group cursor-pointer" onClick={() => router.visit(route('menu'))}>
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10 transition duration-300 group-hover:opacity-40"></div>
                                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                </div>
                                <div className="p-8 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-royal-gold transition font-playfair">{dish.name}</h3>
                                        <span className="text-xl font-bold text-royal-gold">£{dish.price}</span>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed font-light">{dish.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Precision of Taste / Team Brigade */}
            <section className="py-24 bg-gradient-to-b from-transparent to-black/40">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-12">The Precision of Taste</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-royal-gold/40 transition">
                            <i className="fas fa-history text-royal-gold text-4xl mb-6"></i>
                            <h3 className="text-2xl font-bold text-white mb-4">Timing is Everything</h3>
                            <p className="text-gray-400 font-light">Like a synchronized rowing team, our chefs coordinate every second to ensure your flavors are served at their peak intensity.</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-royal-gold/40 transition">
                            <i className="fas fa-shield-alt text-royal-gold text-4xl mb-6"></i>
                            <h3 className="text-2xl font-bold text-white mb-4">Authenticity Guaranteed</h3>
                            <p className="text-gray-400 font-light">Beware of imitators. We pride ourselves on the "Indian Royal" mark of quality. Authentic recipes, real people, royal standards.</p>
                        </div>
                        <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl hover:border-royal-gold/40 transition">
                            <i className="fas fa-users text-royal-gold text-4xl mb-6"></i>
                            <h3 className="text-2xl font-bold text-white mb-4">The Kitchen Brigade</h3>
                            <p className="text-gray-400 font-light">Highly trained, dedicated professionals working in perfect harmony to serve you the finest Indian cuisine in London.</p>
                        </div>
                    </div>
                    <div className="mt-20 p-6 border-t border-white/10">
                        <p className="text-gray-500 text-sm tracking-widest uppercase">
                            Warning: Authentic Royal Standards are exclusive to Indian Royal Dine. imitators will lack the "Team" spirit of our kitchen.
                        </p>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
