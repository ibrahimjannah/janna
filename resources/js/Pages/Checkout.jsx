import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Checkout({ cartItems, addresses, defaultAddress, subtotal, tax, deliveryFee, total }) {
    const [selectedAddress, setSelectedAddress] = useState(defaultAddress?.id || '');
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const { auth } = usePage().props;
    const user = auth.user;

    const [guestData, setGuestData] = useState({
        name: '',
        email: '',
        password: '',
        address_line1: '',
        city: '',
        postcode: '',
        phone: '',
    });

    const [newAddress, setNewAddress] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        postcode: '',
        phone: '',
        is_default: false,
    });

    const handleGuestChange = (e) => {
        setGuestData({ ...guestData, [e.target.name]: e.target.value });
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('addresses.store'), newAddress);
            if (response.data.success) {
                setSelectedAddress(response.data.address.id);
                setShowNewAddress(false);
                router.reload({ only: ['addresses'] });
            }
        } catch (error) {
            alert('Failed to add address');
        }
    };

    const handlePlaceOrder = async () => {
        if (!user && (!guestData.name || !guestData.email || !guestData.password || !guestData.address_line1)) {
            alert('Please fill in all required fields');
            return;
        }

        if (user && !selectedAddress) {
            alert('Please select a delivery address');
            return;
        }

        setProcessing(true);

        try {
            const payload = user ? {
                address_id: selectedAddress,
                delivery_instructions: deliveryInstructions,
                payment_method: paymentMethod,
            } : {
                ...guestData,
                delivery_instructions: deliveryInstructions,
                payment_method: paymentMethod,
            };

            const response = await axios.post(route('checkout.store'), payload);

            if (response.data.success) {
                router.visit(route('order.confirmation', response.data.order_id));
            }
        } catch (error) {
            alert('Failed to place order: ' + (error.response?.data?.message || error.message));
            setProcessing(false);
        }
    };

    return (
        <MainLayout>
            <Head title="Checkout" />
            <div className="min-h-screen py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-8 drop-shadow-md">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Guest Registration / Address Selection */}
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-playfair font-bold text-white mb-6 border-b border-white/10 pb-4">
                                    {user ? 'Delivery Address' : 'Customer Details'}
                                </h2>

                                {!user ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="text" name="name" placeholder="Full Name" value={guestData.name} onChange={handleGuestChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold" required />
                                            <input type="email" name="email" placeholder="Email Address" value={guestData.email} onChange={handleGuestChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold" required />
                                        </div>
                                        <input type="password" name="password" placeholder="Create Password" value={guestData.password} onChange={handleGuestChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold" required />

                                        <h3 className="font-semibold text-lg text-white mt-6 mb-4">Delivery Address</h3>
                                        <input type="text" name="address_line1" placeholder="Address Line 1" value={guestData.address_line1} onChange={handleGuestChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold" required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" name="city" placeholder="City" value={guestData.city} onChange={handleGuestChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold" required />
                                            <input type="text" name="postcode" placeholder="Postcode" value={guestData.postcode} onChange={handleGuestChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold" required />
                                        </div>
                                        <input type="text" name="phone" placeholder="Phone Number" value={guestData.phone} onChange={handleGuestChange} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold" required />
                                    </div>
                                ) : (
                                    <>
                                        {addresses && addresses.length > 0 && (
                                            <div className="space-y-3 mb-6">
                                                {addresses.map((address) => (
                                                    <label key={address.id} className={`flex items-start gap-4 p-5 border rounded-xl cursor-pointer transition duration-300 ${selectedAddress === address.id ? 'bg-royal-gold/20 border-royal-gold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                                        <input
                                                            type="radio"
                                                            name="address"
                                                            value={address.id}
                                                            checked={selectedAddress === address.id}
                                                            onChange={(e) => setSelectedAddress(parseInt(e.target.value))}
                                                            className="mt-1 text-royal-gold focus:ring-royal-gold bg-gray-800 border-gray-600"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-white text-lg">{address.address_line_1}</p>
                                                            {address.address_line_2 && <p className="text-sm text-gray-400">{address.address_line_2}</p>}
                                                            <p className="text-sm text-gray-400">{address.city} {address.postcode}</p>
                                                            <p className="text-sm text-gray-400">{address.phone}</p>
                                                            {address.is_default && <span className="text-xs bg-royal-gold text-royal-brown px-2 py-1 rounded mt-2 inline-block font-bold">Default</span>}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {user && (
                                    <button
                                        onClick={() => setShowNewAddress(!showNewAddress)}
                                        className="text-royal-gold hover:text-white font-medium transition duration-300 flex items-center"
                                    >
                                        <i className="fas fa-plus-circle mr-2"></i> Add New Address
                                    </button>
                                )}

                                {user && showNewAddress && (
                                    <form onSubmit={handleAddAddress} className="mt-6 space-y-4 border-t border-white/10 pt-6 animate-fade-in">
                                        <input
                                            type="text"
                                            placeholder="Address Line 1"
                                            value={newAddress.address_line_1}
                                            onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Address Line 2 (Optional)"
                                            value={newAddress.address_line_2}
                                            onChange={(e) => setNewAddress({ ...newAddress, address_line_2: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                className="px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Postcode"
                                                value={newAddress.postcode}
                                                onChange={(e) => setNewAddress({ ...newAddress, postcode: e.target.value })}
                                                className="px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold"
                                                required
                                            />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold"
                                            required
                                        />
                                        <button type="submit" className="bg-royal-gold text-royal-brown font-bold px-8 py-3 rounded-full hover:bg-white transition duration-300 shadow-lg">
                                            Save Address
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Delivery Instructions */}
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-playfair font-bold text-white mb-4">Delivery Instructions</h2>
                                <textarea
                                    value={deliveryInstructions}
                                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                                    placeholder="Any special instructions for delivery? (Optional)"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-gold h-32"
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-playfair font-bold text-white mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition duration-300 ${paymentMethod === 'card' ? 'bg-royal-gold/20 border-royal-gold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="text-royal-gold focus:ring-royal-gold bg-gray-800 border-gray-600"
                                        />
                                        <span className="text-white font-medium text-lg">Credit/Debit Card</span>
                                        <i className="fas fa-credit-card ml-auto text-gray-400"></i>
                                    </label>
                                    <label className={`flex items-center gap-4 p-5 border rounded-xl cursor-pointer transition duration-300 ${paymentMethod === 'cash' ? 'bg-royal-gold/20 border-royal-gold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cash"
                                            checked={paymentMethod === 'cash'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="text-royal-gold focus:ring-royal-gold bg-gray-800 border-gray-600"
                                        />
                                        <span className="text-white font-medium text-lg">Cash on Delivery</span>
                                        <i className="fas fa-money-bill-wave ml-auto text-gray-400"></i>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl p-8 sticky top-24">
                                <h2 className="text-2xl font-playfair font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm text-gray-300">
                                            <span>{item.quantity}x {item.menu.name}</span>
                                            <span className="font-medium text-white">£{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-white/10 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-300">
                                        <span>Subtotal</span>
                                        <span>£{parseFloat(subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Tax (10%)</span>
                                        <span>£{parseFloat(tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                        <span>Delivery Fee</span>
                                        <span>£{parseFloat(deliveryFee).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-white/20 pt-4 flex justify-between text-2xl font-bold text-royal-gold">
                                        <span>Total</span>
                                        <span>£{parseFloat(total).toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={processing || (user && !selectedAddress) || (!user && (!guestData.name || !guestData.email || !guestData.password || !guestData.address_line1))}
                                    className="w-full mt-8 bg-royal-gold text-royal-brown py-4 rounded-full hover:bg-white transition duration-300 font-bold shadow-lg disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {processing ? 'Processing...' : 'Place Order'}
                                </button>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Estimated delivery: 45 minutes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
