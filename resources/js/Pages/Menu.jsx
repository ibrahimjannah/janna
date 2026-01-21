import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Menu({ auth, categories, userFavorites = [], cartQuantities = {} }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [addingToCart, setAddingToCart] = useState({});
    const [favorites, setFavorites] = useState(new Set(userFavorites));
    const [quantities, setQuantities] = useState(cartQuantities);

    // Sync props with state if they change (e.g. after navigation)
    React.useEffect(() => {
        setQuantities(cartQuantities);
    }, [cartQuantities]);

    const allItems = categories.flatMap(cat => cat.menus.map(item => ({ ...item, category_slug: cat.slug })));

    // Filter items logic
    const displayedItems = activeCategory === 'All'
        ? allItems
        : categories.find(c => c.name === activeCategory)?.menus || [];

    const addToCart = async (item) => {
        setAddingToCart(prev => ({ ...prev, [item.id]: true }));

        try {
            const response = await axios.post(route('cart.add'), {
                menu_id: item.id,
                quantity: 1
            });

            if (response.data.success) {
                // Optimistically update quantity
                setQuantities(prev => ({
                    ...prev,
                    [item.id]: (prev[item.id] || 0) + 1
                }));
                // Reload shared data (cartCount in navbar)
                router.reload({ only: ['cartCount', 'cartQuantities'] });
            }
        } catch (error) {
            alert('Failed to add item to cart');
        } finally {
            setAddingToCart(prev => ({ ...prev, [item.id]: false }));
        }
    };

    const toggleFavorite = async (item) => {
        if (!auth.user) {
            alert('Please login to save favorites');
            return;
        }

        const isFav = favorites.has(item.id);
        const newFavorites = new Set(favorites);

        // Optimistic update
        if (isFav) {
            newFavorites.delete(item.id);
        } else {
            newFavorites.add(item.id);
        }
        setFavorites(newFavorites);

        try {
            await axios.post(route('favorites.toggle', item.id));
        } catch (error) {
            // Revert on failure
            setFavorites(favorites);
            alert('Failed to update favorite');
        }
    };

    const viewCart = () => {
        router.visit(route('cart.index'));
    };

    return (
        <MainLayout user={auth.user}>
            <Head title="Our Menu" />

            <section className="py-16 min-h-screen">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-6xl font-playfair font-bold text-center text-white mb-4 drop-shadow-md">Our Royal Menu</h2>
                    <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12 text-lg">Authentic Indian dishes prepared with traditional recipes</p>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <button
                            onClick={() => setActiveCategory('All')}
                            className={`px-6 py-2 rounded-full font-medium transition duration-300 border border-transparent ${activeCategory === 'All' ? 'bg-royal-gold text-royal-brown shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 hover:border-white/20 backdrop-blur-sm'}`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`px-6 py-2 rounded-full font-medium transition duration-300 border border-transparent ${activeCategory === cat.name ? 'bg-royal-gold text-royal-brown shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 hover:border-white/20 backdrop-blur-sm'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Quality & Health Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <div className="bg-gradient-to-br from-green-900/40 to-black/40 backdrop-blur-md border border-green-500/20 p-6 rounded-3xl flex items-center gap-5 group hover:border-green-500/40 transition">
                            <div className="w-16 h-16 shrink-0 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
                                <i className="fas fa-leaf text-2xl group-hover:scale-110 transition"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg mb-1">Royal Organic</h4>
                                <p className="text-gray-400 text-sm leading-snug">We exclusively use Organic Chicken, Lamb, and Vegetables in our premium range.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-900/40 to-black/40 backdrop-blur-md border border-blue-500/20 p-6 rounded-3xl flex items-center gap-5 group hover:border-blue-500/40 transition">
                            <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <i className="fas fa-seedling text-2xl group-hover:scale-110 transition"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg mb-1">Plant-Based Perfection</h4>
                                <p className="text-gray-400 text-sm leading-snug">Substitute any curry with our high-quality plant-based protein substitutes.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-royal-gold/20 to-black/40 backdrop-blur-md border border-royal-gold/20 p-6 rounded-3xl flex items-center gap-5 group hover:border-royal-gold/40 transition">
                            <div className="w-16 h-16 shrink-0 rounded-2xl bg-royal-gold/10 flex items-center justify-center text-royal-gold">
                                <i className="fas fa-heartbeat text-2xl group-hover:scale-110 transition"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg mb-1">Royal Wellness</h4>
                                <p className="text-gray-400 text-sm leading-snug">Balanced, nutrient-dense "Eat Well" bowls designed for the modern lifestyle.</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {displayedItems.map(item => (
                            <div key={item.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden transition duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-white/20 relative group">
                                <div className="aspect-[16/9] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 z-10"></div>
                                    <img src={item.image || '/images/hero.png'} alt={item.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                    {/* Quantity Overlay */}
                                    {quantities[item.id] > 0 && (
                                        <div className="absolute top-4 left-4 bg-royal-gold text-royal-brown font-bold px-3 py-1 rounded-full shadow-lg z-20">
                                            {quantities[item.id]} in cart
                                        </div>
                                    )}
                                </div>

                                {/* Favorite Button */}
                                <button
                                    onClick={() => toggleFavorite(item)}
                                    className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-black/70 transition duration-300 z-20 border border-white/10"
                                >
                                    <i className={`${favorites.has(item.id) ? 'fas fa-heart text-red-500' : 'far fa-heart text-white'} text-xl`}></i>
                                </button>

                                <div className="p-6 relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white font-playfair">{item.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                                        </div>
                                        <span className="text-lg font-bold text-royal-gold">£{item.price}</span>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            {/* Spice Level Indicator */}
                                            {item.spice_level > 0 && Array.from({ length: item.spice_level }).map((_, i) => (
                                                <i key={i} className="fas fa-pepper-hot text-red-500"></i>
                                            ))}
                                            {!!item.is_signature && (
                                                <span className="bg-royal-gold/20 border border-royal-gold/50 text-royal-gold text-xs px-2 py-1 rounded-full">Signature</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => addToCart(item)}
                                            disabled={addingToCart[item.id]}
                                            className="bg-royal-red hover:bg-red-700 text-white px-4 py-2 rounded-full transition duration-300 disabled:bg-gray-600 font-medium shadow-md hover:shadow-lg relative overflow-hidden"
                                        >
                                            {addingToCart[item.id] ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* View Cart Button */}
                    <div className="mt-12 text-center">
                        <button
                            onClick={viewCart}
                            className="bg-royal-gold hover:bg-amber-600 text-royal-brown font-bold py-4 px-12 rounded-full text-lg transition duration-300 inline-flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            View Cart
                        </button>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
