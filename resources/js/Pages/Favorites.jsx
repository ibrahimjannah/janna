import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useState } from 'react';

export default function Favorites({ auth, favorites }) {
    const [addingToCart, setAddingToCart] = useState({});

    const addToCart = async (item) => {
        setAddingToCart(prev => ({ ...prev, [item.id]: true }));

        try {
            const response = await axios.post(route('cart.add'), {
                menu_id: item.id,
                quantity: 1
            });

            if (response.data.success) {
                // Consider adding a toast notification here instead of alert
                // alert(`${item.name} added to cart!`); 
            }
        } catch (error) {
            alert('Failed to add item to cart');
        } finally {
            setAddingToCart(prev => ({ ...prev, [item.id]: false }));
        }
    };

    const removeFavorite = async (item) => {
        if (confirm('Remove this item from favorites?')) {
            router.post(route('favorites.toggle', item.id));
        }
    };

    return (
        <MainLayout user={auth.user}>
            <Head title="My Favorites" />

            <div className="py-16 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-playfair font-bold text-white mb-8 px-4 border-b border-white/10 pb-6">My Favorites</h2>

                    {favorites.length === 0 ? (
                        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-16 text-center shadow-xl">
                            <i className="far fa-heart text-7xl text-gray-400 mb-6 font-thin"></i>
                            <h3 className="text-2xl font-medium text-white mb-2">No favorites yet</h3>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">Save your favorite dishes to easily find them later. Explore our menu to find something you love!</p>
                            <Link
                                href={route('menu')}
                                className="inline-flex items-center px-8 py-3 bg-royal-gold border border-transparent rounded-full font-bold text-royal-brown hover:bg-white hover:shadow-lg transition ease-in-out duration-300 transform hover:scale-105"
                            >
                                Browse Menu
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                            {favorites.map(({ menu: item }) => (
                                <div key={item.id} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col hover:bg-black/50 transition duration-300">
                                    <div className="relative aspect-[16/9] group">
                                        <img
                                            src={item.image || '/images/hero.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition duration-500"></div>
                                        <button
                                            onClick={() => removeFavorite(item)}
                                            className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-3 rounded-full hover:bg-red-600 text-red-500 hover:text-white transition-all duration-300 border border-white/10"
                                            title="Remove from favorites"
                                        >
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>

                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-white font-playfair">{item.name}</h3>
                                            <span className="font-bold text-royal-gold text-lg">£{item.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-3">{item.description}</p>

                                        <button
                                            onClick={() => addToCart(item)}
                                            disabled={addingToCart[item.id]}
                                            className="w-full bg-white/10 text-white py-3 rounded-xl hover:bg-royal-gold hover:text-royal-brown transition-all duration-300 disabled:opacity-50 border border-white/20 hover:border-transparent font-semibold shadow-lg"
                                        >
                                            <i className="fas fa-cart-plus mr-2"></i>
                                            {addingToCart[item.id] ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
