import POSLayout from '@/Layouts/POSLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function POSOrders({ auth, tables, categories }) {
    const [selectedTable, setSelectedTable] = useState(null);
    const [orderType, setOrderType] = useState('dine-in');
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || null);
    const [notes, setNotes] = useState('');

    const addToCart = (menu) => {
        const existingItem = cart.find(item => item.menu_id === menu.id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.menu_id === menu.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                menu_id: menu.id,
                name: menu.name,
                price: menu.price,
                quantity: 1,
                special_instructions: ''
            }]);
        }
    };

    const updateQuantity = (menuId, change) => {
        setCart(cart.map(item => {
            if (item.menu_id === menuId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
        }).filter(Boolean));
    };

    const removeFromCart = (menuId) => {
        setCart(cart.filter(item => item.menu_id !== menuId));
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        return { subtotal, tax, total: subtotal + tax };
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) {
            alert('Please add items to cart');
            return;
        }

        if (orderType === 'dine-in' && !selectedTable) {
            alert('Please select a table');
            return;
        }

        const orderData = {
            table_id: orderType === 'dine-in' ? selectedTable : null,
            order_type: orderType,
            items: cart,
            notes: notes
        };

        try {
            const response = await fetch(route('pos.orders.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (result.success) {
                alert('Order created successfully!');
                setCart([]);
                setNotes('');
                setSelectedTable(null);
                router.visit(route('pos.payment.create', result.order.id));
            } else {
                alert('Error creating order: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create order');
        }
    };

    const totals = calculateTotal();
    const selectedCategoryData = categories.find(c => c.id === selectedCategory);

    return (
        <POSLayout user={auth.user}>
            <Head title="New Order" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
                {/* Left Side - Menu Selection */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-royal-brown/5">
                    <div className="p-6 border-b border-royal-brown/5 bg-royal-cream/10">
                        <h2 className="text-3xl font-playfair font-black text-royal-brown tracking-tighter uppercase mb-4">Royal Menu</h2>

                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Order Type Selection */}
                            <div className="flex bg-royal-cream/30 p-1 rounded-xl border border-royal-brown/5">
                                {['dine-in', 'takeaway', 'delivery'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setOrderType(type)}
                                        className={`px-6 py-2 rounded-lg font-black uppercase tracking-widest text-[10px] transition-all ${orderType === type
                                            ? 'bg-royal-gold text-royal-brown shadow-lg'
                                            : 'text-royal-brown/40 hover:text-royal-brown'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Category Tabs */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {categories?.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-5 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] whitespace-nowrap transition-all border ${selectedCategory === category.id
                                            ? 'bg-royal-brown text-royal-gold border-royal-brown shadow-md'
                                            : 'bg-white text-royal-brown/60 border-royal-brown/10 hover:border-royal-gold/50'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-royal-cream/5">
                        {/* Table Selection for Dine-in */}
                        {orderType === 'dine-in' && (
                            <div className="mb-8">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-royal-brown/40 mb-3">
                                    Select Available Table
                                </label>
                                <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                    {tables?.filter(t => t.status === 'available').map(table => (
                                        <button
                                            key={table.id}
                                            onClick={() => setSelectedTable(table.id)}
                                            className={`aspect-square flex items-center justify-center rounded-2xl font-black text-sm transition-all border-2 ${selectedTable === table.id
                                                ? 'bg-green-600 text-white border-green-700 shadow-xl scale-110'
                                                : 'bg-white text-royal-brown border-royal-brown/5 hover:border-royal-gold hover:bg-royal-gold/5'
                                                }`}
                                        >
                                            {table.table_number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Menu Items Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {selectedCategoryData?.menus?.map(menu => (
                                <button
                                    key={menu.id}
                                    onClick={() => addToCart(menu)}
                                    className="bg-white border border-royal-brown/5 rounded-2xl p-5 hover:shadow-2xl hover:border-royal-gold/30 transition-all text-left flex flex-col justify-between group h-44 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-royal-gold/5 rounded-bl-full group-hover:bg-royal-gold/10 transition-colors"></div>
                                    <div>
                                        <h3 className="font-bold text-royal-brown mb-1 group-hover:text-royal-spice transition-colors font-poppins text-sm uppercase tracking-tight leading-tight">
                                            {menu.name}
                                        </h3>
                                        <p className="text-[10px] text-royal-brown/50 line-clamp-3 font-medium">
                                            {menu.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-xl font-black text-royal-spice font-playfair">
                                            £{menu.price}
                                        </p>
                                        <div className="w-8 h-8 bg-royal-gold/10 rounded-full flex items-center justify-center text-royal-brown group-hover:bg-royal-gold transition-colors">
                                            <span className="font-black">+</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Cart */}
                <div className="bg-royal-brown rounded-3xl shadow-2xl p-6 flex flex-col text-royal-cream border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-2xl">💍</span>
                        <h2 className="text-xl font-playfair font-black tracking-widest uppercase">Your Order</h2>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto mb-6 pr-2 no-scrollbar">
                        {cart.length === 0 ? (
                            <div className="text-center py-20 opacity-30">
                                <div className="text-6xl mb-4">🍽️</div>
                                <p className="font-black uppercase tracking-widest text-[10px]">Awaiting selection</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.menu_id} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-sm font-poppins uppercase tracking-tight truncate pr-4">{item.name}</h4>
                                            <button
                                                onClick={() => removeFromCart(item.menu_id)}
                                                className="text-white/30 hover:text-royal-spice transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3 bg-white/10 p-1 rounded-full border border-white/10">
                                                <button
                                                    onClick={() => updateQuantity(item.menu_id, -1)}
                                                    className="w-7 h-7 bg-white/5 rounded-full hover:bg-white/20 font-black transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="font-black w-4 text-center text-xs">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.menu_id, 1)}
                                                    className="w-7 h-7 bg-royal-gold text-royal-brown rounded-full hover:bg-amber-600 font-black transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-black text-royal-gold text-lg font-playfair">
                                                £{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes & Totals */}
                    <div className="mt-auto space-y-6">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                                Special Instructions
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-transparent border-0 p-0 focus:ring-0 text-sm placeholder:text-white/20 resize-none"
                                rows="2"
                                placeholder="Add notes here..."
                            />
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/10">
                            <div className="flex justify-between text-xs font-bold text-white/50">
                                <span className="uppercase tracking-widest">Subtotal</span>
                                <span>£{totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-white/50">
                                <span className="uppercase tracking-widest">Tax (10%)</span>
                                <span>£{totals.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-2xl font-black text-royal-gold pt-2 border-t border-dashed border-white/20">
                                <span className="font-playfair uppercase tracking-tighter">Grand Total</span>
                                <span className="font-playfair">£{totals.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitOrder}
                            disabled={cart.length === 0}
                            className="w-full bg-royal-gold text-royal-brown py-5 rounded-2xl font-black text-sm hover:bg-amber-600 disabled:opacity-20 disabled:grayscale transition-all shadow-2xl uppercase tracking-[0.2em]"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </POSLayout>
    );
}
