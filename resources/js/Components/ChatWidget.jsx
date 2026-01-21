import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Welcome! I am your Royal Assistant. 👑 How may I serve you today? I can assist you with our authentic menu, table reservations, or any guest inquiries you may have.",
            sender: 'ai',
            quick_replies: [
                { text: "View Menu 🥘", message: "Food Menu" },
                { text: "Book Table 📅", message: "Book a table" },
                { text: "My Profile 👤", message: "My Profile" }
            ]
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cartQuantities, setCartQuantities] = useState({});
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const messagesEndRef = useRef(null);

    // Generate or get Guest ID
    const guestId = React.useMemo(() => {
        let id = localStorage.getItem('guest_id');
        if (!id) {
            id = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guest_id', id);
        }
        return id;
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const fetchCartQuantities = async () => {
        try {
            const response = await axios.get('/api/cart/details_with_ids');
            setCartQuantities(response.data);
        } catch (error) {
            console.error("Error fetching cart details:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCartQuantities();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleCartChange = () => fetchCartQuantities();
        window.addEventListener('cart-updated', handleCartChange);
        return () => window.removeEventListener('cart-updated', handleCartChange);
    }, []);

    const handleSendMessage = async (textOverride = null) => {
        const text = textOverride || inputText;
        if (!text.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            text: text,
            sender: 'user',
        };

        setMessages(prev => [...prev, newUserMessage]);
        if (!textOverride) setInputText('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/chat', {
                message: text,
                guest_id: guestId
            });

            const aiMessage = {
                id: Date.now() + 1,
                text: response.data.message,
                sender: 'ai',
                action: response.data.action,
                items: response.data.items,
                quick_replies: response.data.quick_replies
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I apologize, but the royal kitchen is currently busy. Please try again.",
                sender: 'ai'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Load messages from local storage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chat_history');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
    }, []);

    // Save messages to local storage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chat_history', JSON.stringify(messages));
        }
    }, [messages]);

    const checkCouponTiers = (subtotalRaw, appliedCoupon) => {
        const subtotal = parseFloat(subtotalRaw);
        if (!subtotal || isNaN(subtotal)) return;

        // Don't suggest if coupon is already applied
        if (appliedCoupon) return;

        let suggestedCode = null;
        let discountPercent = 0;

        if (subtotal >= 1000) { suggestedCode = 'ROYAL20FREE'; discountPercent = 20; }
        else if (subtotal >= 500) { suggestedCode = 'ROYAL15'; discountPercent = 15; }
        else if (subtotal >= 300) { suggestedCode = 'ROYAL10'; discountPercent = 10; }
        else if (subtotal >= 100) { suggestedCode = 'ROYAL5'; discountPercent = 5; }

        if (suggestedCode) {
            // Check if we already suggested this specific code RECENTLY (last 5 messages)
            // This prevents spam but allows re-evaluating if user cleared chat or it's been a while
            const recentMessages = messages.slice(-5);
            const alreadySuggested = recentMessages.some(m =>
                m.sender === 'ai' &&
                m.text &&
                m.text.includes(suggestedCode) &&
                m.action?.type === 'APPLY_COUPON'
            );

            if (!alreadySuggested) {
                const newMessage = {
                    id: Date.now(),
                    text: `🎉 Majestic News! Your order total has unlocked the **${suggestedCode}** coupon! \n\nUse it now for **${discountPercent}% Off**! 👑`,
                    sender: 'ai',
                    action: {
                        type: 'APPLY_COUPON',
                        coupon_code: suggestedCode,
                        button_text: `Apply ${suggestedCode} 👑`
                    },
                    quick_replies: [
                        { text: "View Cart 🛒", message: "Go to Cart" }
                    ]
                };
                setMessages(prev => [...prev, newMessage]);
                setIsOpen(true); // Open chat to show the good news
            }
        }
    };

    const handleAction = async (action) => {
        if (!action) return;
        if (action.type === 'ADD_TO_CART' || action.type === 'UPDATE_QUANTITY') {
            setIsLoading(true);
            try {
                // If it's a simple ADD (from AI suggestion), use the normal add endpoint
                if (action.type === 'ADD_TO_CART') {
                    const response = await axios.post('/cart/add', {
                        menu_id: action.menu_id,
                        quantity: action.quantity || 1
                    });

                    if (response.data.success) {
                        if (!hasConfirmed) {
                            setMessages(prev => [...prev, {
                                id: Date.now(),
                                text: `Excellent! ✅ **${action.item_name}** has been added to your cart.`,
                                sender: 'ai',
                                action: { type: 'NAVIGATE', url: '/cart', button_text: 'View Cart 🛒' }
                            }]);
                            setHasConfirmed(true);
                        }
                        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: response.data.cart_count } }));
                        fetchCartQuantities();

                        // Check for coupon upgrades
                        checkCouponTiers(response.data.subtotal, null);
                    }
                }
                // If it's a QUANTITY UPDATE (from +/- buttons), we need to be smarter
                else if (action.type === 'UPDATE_QUANTITY') {
                    // 1. Get current quantity
                    const currentQty = cartQuantities[action.menu_id]?.quantity || 0;
                    const newQty = currentQty + action.quantity; // action.quantity is +1 or -1
                    const cartItemId = cartQuantities[action.menu_id]?.id;

                    if (!cartItemId) {
                        // Should not happen if buttons are visible, but fallback to add
                        if (newQty > 0) {
                            await axios.post('/cart/add', { menu_id: action.menu_id, quantity: 1 });
                        }
                    } else {
                        if (newQty > 0) {
                            try {
                                const res = await axios.patch(`/cart/${cartItemId}`, { quantity: newQty });
                                if (res.data?.success) {
                                    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: res.data.cart_count } }));
                                    checkCouponTiers(res.data.subtotal, null);
                                } else {
                                    // Fallback if no cart_count returned or redirect
                                    window.dispatchEvent(new CustomEvent('cart-updated'));
                                }
                            } catch (e) {
                                console.error("Update failed", e);
                            }
                        } else {
                            // Remove
                            try {
                                const res = await axios.delete(`/cart/${cartItemId}`);
                                if (res.data?.success) {
                                    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: res.data.cart_count } }));
                                    checkCouponTiers(res.data.subtotal, null);
                                } else {
                                    window.dispatchEvent(new CustomEvent('cart-updated'));
                                }
                            } catch (e) {
                                console.error("Remove failed", e);
                            }
                        }
                    }

                    fetchCartQuantities();
                }

            } catch (error) {
                console.error("Cart Error:", error);
            } finally {
                setIsLoading(false);
            }
        } else if (action.type === 'REMOVE_FROM_CART') {
            setIsLoading(true);
            try {
                const cartItemId = cartQuantities[action.menu_id]?.id;
                if (cartItemId) {
                    await axios.delete(`/cart/${cartItemId}`);
                    window.dispatchEvent(new CustomEvent('cart-updated'));
                    fetchCartQuantities();
                }
            } catch (error) {
                console.error("Remove Error:", error);
            } finally {
                setIsLoading(false);
            }

        } else if (action.type === 'APPLY_COUPON') {
            console.log('Applying coupon:', action.coupon_code);
            setIsLoading(true);
            try {
                const response = await axios.post('/cart/apply-coupon', {
                    code: action.coupon_code
                });

                console.log('Coupon response:', response.data);

                if (response.data.success) {
                    // Successfully applied - show message in chat
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: `Excellent! 👑 **${action.coupon_code}** has been applied to your royal order. You can see the discount in your cart whenever you are ready.`,
                        sender: 'ai',
                        quick_replies: [
                            { text: "View Cart 🛒", message: "Go to Cart" },
                            { text: "Continue Browsing 🥘", message: "Food Menu" }
                        ]
                    }]);
                    window.dispatchEvent(new CustomEvent('cart-updated'));
                } else {
                    // Show error message (e.g., already applied, invalid, etc.)
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: response.data.message.includes('already')
                            ? `👑 This coupon is already added to your royal cart.`
                            : `I apologize, but ${response.data.message}`,
                        sender: 'ai'
                    }]);
                }
            } catch (error) {
                console.error("Coupon Error:", error);
                console.error("Error response:", error.response?.data);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    text: error.response?.data?.message || "I apologize, there was an error applying the coupon. Please try again.",
                    sender: 'ai'
                }]);
            } finally {
                setIsLoading(false);
            }
        } else if (action.type === 'REMOVE_COUPON') {
            setIsLoading(true);
            try {
                const response = await axios.post('/cart/remove-coupon');
                if (response.data.success) {
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: `As you wish. 👑 The coupon has been removed from your royal order.`,
                        sender: 'ai'
                    }]);
                    window.dispatchEvent(new CustomEvent('cart-updated'));
                    fetchCartQuantities();
                }
            } catch (error) {
                console.error("Remove Coupon Error:", error);
            } finally {
                setIsLoading(false);
            }
        } else if (action.type === 'NAVIGATE') {
            setIsOpen(false);
            router.visit(action.url);
        }
    };

    const handleClearHistory = () => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Are you sure you want to clear our conversation history? This cannot be undone. 🗑️",
            sender: 'ai',
            quick_replies: [
                { text: "Yes, Clear All ✅", message: "ACTION_CLEAR_HISTORY" },
                { text: "No, Keep History ❌", message: "ACTION_CANCEL_CLEAR" }
            ]
        }]);
    };

    return (
        <div className={`fixed z-[100] ${isOpen ? 'inset-0 md:inset-auto md:bottom-6 md:right-6' : 'bottom-6 right-6'} flex flex-col items-end font-poppins pointer-events-none`}>

            {/* Chat Window */}
            <div className={`
                ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'}
                transition-all duration-300 transform origin-bottom-right
                w-full h-full md:w-[420px] md:h-[700px] lg:w-[450px]
                bg-black/95 backdrop-blur-2xl border border-royal-gold/40
                md:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)]
                flex flex-col overflow-hidden relative
            `}>
                {/* Header */}
                <div className="bg-gradient-to-r from-royal-brown via-black to-royal-brown p-5 flex justify-between items-center border-b border-royal-gold/30 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-royal-gold to-yellow-800 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-white/20">
                            <i className="fas fa-crown text-white"></i>
                        </div>
                        <div>
                            <h3 className="text-royal-gold font-playfair font-bold text-xl tracking-wide">Royal Assistant</h3>
                            <div className="flex items-center gap-2 opacity-90">
                                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] text-gray-300 uppercase tracking-[0.2em] font-bold">Chef's Bridge Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleClearHistory} className="text-royal-gold/60 hover:text-red-500 transition-all p-2.5 hover:bg-white/10 rounded-full" title="Clear History">
                            <i className="fas fa-trash-alt text-lg"></i>
                        </button>
                        <button onClick={() => setIsOpen(false)} className="text-royal-gold/60 hover:text-white transition-all p-2.5 hover:bg-white/10 rounded-full">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scrollbar-thin scrollbar-thumb-royal-gold/20 scrollbar-track-transparent">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
                            {msg.sender === 'ai' && (
                                <div className="w-9 h-9 rounded-full bg-royal-gold/10 border border-royal-gold/30 flex items-center justify-center mr-3 mt-1 shrink-0">
                                    <i className="fas fa-crown text-xs text-royal-gold"></i>
                                </div>
                            )}
                            <div className={`max-w-[90%] md:max-w-[85%] flex flex-col gap-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-5 py-3.5 text-sm md:text-base leading-relaxed relative ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-royal-gold to-yellow-600 text-royal-brown font-bold rounded-2xl rounded-tr-none shadow-xl'
                                    : 'bg-white/5 text-gray-200 border border-white/10 rounded-2xl rounded-tl-none backdrop-blur-md'
                                    }`}>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                </div>

                                {/* Rich Items Grid */}
                                {msg.items && msg.items.length > 0 && (
                                    <div className="flex flex-col gap-4 w-full mt-2">
                                        {msg.items.map(item => (
                                            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex shadow-lg hover:border-royal-gold/40 transition-colors group/item min-h-[120px]">
                                                <div className="w-1/3 overflow-hidden relative">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" onError={(e) => e.target.src = '/images/hero.png'} />
                                                    <div className="absolute top-2 left-2 bg-royal-gold/90 text-royal-brown px-2 py-0.5 rounded text-[10px] font-black shadow-md">
                                                        £{item.price}
                                                    </div>
                                                    {item.badge && (
                                                        <div className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider shadow-lg border border-white/20 ${item.badge === 'Signature'
                                                            ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white animate-pulse'
                                                            : 'bg-black/60 text-royal-gold'
                                                            }`}>
                                                            {item.badge}
                                                        </div>
                                                    )}
                                                    {cartQuantities[item.id] > 0 && (
                                                        <div className="absolute -top-1 -right-1 bg-green-500 text-white w-6 h-6 rounded-full text-[12px] font-black shadow-lg flex items-center justify-center border-2 border-black z-10 animate-scale-in">
                                                            {cartQuantities[item.id].quantity || cartQuantities[item.id]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-2/3 p-3 flex flex-col justify-between">
                                                    <div>
                                                        <h4 className="text-royal-gold font-bold text-base truncate">{item.name}</h4>
                                                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{item.description}</p>
                                                    </div>
                                                    {cartQuantities[item.id] ? (
                                                        <div className="mt-2 flex items-center justify-between gap-2">
                                                            <div className="flex items-center bg-royal-gold/10 border border-royal-gold/30 rounded-lg overflow-hidden">
                                                                <button
                                                                    onClick={() => handleAction({ type: 'UPDATE_QUANTITY', menu_id: item.id, quantity: -1 })}
                                                                    className="px-3 py-1.5 hover:bg-royal-gold hover:text-royal-brown text-royal-gold transition-colors"
                                                                >
                                                                    <i className="fas fa-minus text-[10px]"></i>
                                                                </button>
                                                                <span className="px-3 text-royal-gold font-bold text-xs">{cartQuantities[item.id].quantity || cartQuantities[item.id]}</span>
                                                                <button
                                                                    onClick={() => handleAction({ type: 'UPDATE_QUANTITY', menu_id: item.id, quantity: 1 })}
                                                                    className="px-3 py-1.5 hover:bg-royal-gold hover:text-royal-brown text-royal-gold transition-colors"
                                                                >
                                                                    <i className="fas fa-plus text-[10px]"></i>
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => handleAction({ type: 'REMOVE_FROM_CART', menu_id: item.id })}
                                                                className="p-1.5 text-red-500 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
                                                                title="Remove item"
                                                            >
                                                                <i className="fas fa-trash-alt text-xs"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAction({ type: 'ADD_TO_CART', menu_id: item.id, item_name: item.name })}
                                                            className="mt-2 w-full bg-royal-gold/10 hover:bg-royal-gold text-royal-gold hover:text-royal-brown border border-royal-gold/30 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-tight"
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}


                                {/* Action Button - Shows FIRST (Apply Royal button) */}
                                {msg.action && (
                                    <div className="w-full mb-2">
                                        <button
                                            onClick={() => handleAction(msg.action)}
                                            className="mt-1 bg-royal-gold hover:bg-white text-royal-brown font-bold text-sm py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-3 border border-transparent hover:border-royal-gold w-full justify-center"
                                        >
                                            <i className="fas fa-ticket-alt text-sm"></i>
                                            {msg.action.button_text}
                                        </button>
                                    </div>
                                )}

                                {/* Quick Replies / Suggestions - Shows SECOND (View Cart button) */}
                                {msg.quick_replies && (
                                    <div className={`flex flex-wrap gap-3 mt-4 ${msg.action ? 'justify-center w-full' : ''}`}>
                                        {msg.quick_replies.map((reply, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    // Handle Special Actions
                                                    if (reply.message === "Go to Cart") {
                                                        setIsOpen(false);
                                                        router.visit('/cart');
                                                    } else if (reply.message === "ACTION_CLEAR_HISTORY") {
                                                        localStorage.removeItem('chat_history');
                                                        setMessages([{
                                                            id: Date.now(),
                                                            text: "As you wish. 🧹 Your conversation history has been cleared. How may I serve you anew? 👑",
                                                            sender: 'ai',
                                                            quick_replies: [
                                                                { text: "View Menu 🥘", message: "Food Menu" },
                                                                { text: "Book Table 📅", message: "Book a table" }
                                                            ]
                                                        }]);
                                                    } else if (reply.message === "ACTION_CANCEL_CLEAR") {
                                                        setMessages(prev => [...prev, {
                                                            id: Date.now(),
                                                            text: "Understood. The scroll of our history remains safe. 📜",
                                                            sender: 'ai'
                                                        }]);
                                                    } else {
                                                        handleSendMessage(reply.message);
                                                    }
                                                }}
                                                className={`bg-royal-gold hover:bg-white text-royal-brown font-bold text-sm py-3 px-8 rounded-full shadow-lg transition-all flex items-center gap-3 border border-transparent hover:border-royal-gold justify-center ${msg.action ? 'w-auto min-w-[180px]' : 'w-full'}`}
                                            >
                                                <i className={`fas ${reply.text.includes('Cart') ? 'fa-shopping-cart' :
                                                    reply.text.includes('Menu') ? 'fa-utensils' :
                                                        reply.text.includes('Table') ? 'fa-calendar-alt' :
                                                            reply.text.includes('Apply') ? 'fa-ticket-alt' : 'fa-comment-dots'
                                                    } text-sm`}></i>
                                                {reply.text}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start ml-12">
                            <div className="flex gap-2 items-center bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                                <span className="text-[10px] text-royal-gold/50 font-bold uppercase tracking-widest mr-2">Chef is thinking</span>
                                <div className="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="p-4 md:p-6 bg-black/80 backdrop-blur-md border-t border-royal-gold/10 flex gap-4 shrink-0 z-10"
                >
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Try 'Food Menu' or 'Butter Chicken'..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm md:text-base text-gray-100 placeholder-gray-500 focus:ring-1 focus:ring-royal-gold/50 focus:border-royal-gold/30 focus:outline-none transition-all group-hover:bg-white/10"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
                            <i className="fas fa-keyboard text-xs text-royal-gold"></i>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isLoading}
                        className="bg-royal-gold hover:bg-white disabled:opacity-30 text-royal-brown w-14 h-14 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center shrink-0 active:scale-95"
                    >
                        <i className="fas fa-paper-plane text-xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                    </button>
                </form>
            </div>

            {/* Launcher Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative transition-all duration-700 hover:scale-110 active:scale-90 pointer-events-auto"
                >
                    <div className="absolute inset-0 bg-royal-gold rounded-full blur-2xl opacity-40 group-hover:opacity-80 animate-pulse duration-3000"></div>
                    <div className="relative w-16 h-16 md:w-22 md:h-22 bg-gradient-to-br from-royal-brown via-black to-royal-brown rounded-full shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center border-2 border-royal-gold/40 group-hover:border-royal-gold transition-colors overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-royal-gold/10 to-transparent"></div>
                        <i className="fas fa-crown text-3xl md:text-4xl text-royal-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] transform group-hover:scale-110 transition-transform duration-500"></i>
                    </div>
                    {/* Badge */}
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-royal-gold border-2 border-black"></span>
                    </span>
                    {/* Tooltip */}
                    <div className="absolute right-full mr-5 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-xl border border-royal-gold/30 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold text-royal-gold whitespace-nowrap opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 pointer-events-none">
                        <div className="flex flex-col gap-1">
                            <p>Royal AI is Online</p>
                            <p className="text-[9px] text-gray-400 font-normal uppercase tracking-widest">Ask for Food & Offers</p>
                        </div>
                        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-black/90 border-t border-r border-royal-gold/30 rotate-45"></div>
                    </div>
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
