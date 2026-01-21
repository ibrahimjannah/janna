import POSLayout from '@/Layouts/POSLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ auth, order }) {
    const { data, setData, post, processing } = useForm({
        amount: order.total,
        payment_method: 'cash',
        transaction_id: '',
    });

    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('pos.payment.store', order.id), {
            onSuccess: () => setPaymentSuccess(true)
        });
    };

    if (paymentSuccess) {
        return (
            <POSLayout user={auth.user}>
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] shadow-2xl max-w-2xl mx-auto border border-royal-brown/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-royal-gold"></div>
                    <div className="w-28 h-28 bg-royal-gold rounded-full flex items-center justify-center text-royal-brown text-6xl mb-8 shadow-2xl border-8 border-royal-cream animate-bounce">
                        ✓
                    </div>
                    <h2 className="text-4xl font-black text-royal-brown mb-3 font-playfair uppercase tracking-tighter">Payment Royal!</h2>
                    <p className="text-royal-brown/40 mb-12 font-bold font-poppins uppercase tracking-widest text-xs">Order {order.order_number} has been settled.</p>
                    <div className="flex space-x-6">
                        <a href={route('pos.payment.receipt', order.id)} className="bg-royal-gold text-royal-brown font-black px-10 py-5 rounded-2xl hover:bg-amber-600 transition-all shadow-xl uppercase tracking-[0.2em] text-xs">
                            Print Receipt
                        </a>
                        <a href={route('pos.orders.index')} className="bg-royal-brown text-royal-cream font-black px-10 py-5 rounded-2xl hover:bg-black transition-all shadow-xl uppercase tracking-[0.2em] text-xs">
                            New Order
                        </a>
                    </div>
                </div>
            </POSLayout>
        );
    }

    return (
        <POSLayout user={auth.user}>
            <Head title={`Payment - ${order.order_number}`} />

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-royal-brown/5">
                    <h2 className="text-3xl font-black text-royal-brown mb-8 font-playfair uppercase tracking-tighter">Summary</h2>
                    <div className="space-y-4 mb-8">
                        {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-royal-brown group">
                                <div className="font-poppins flex items-center">
                                    <span className="w-8 h-8 bg-royal-gold/10 rounded-full flex items-center justify-center font-black text-[10px] text-royal-spice mr-3 group-hover:bg-royal-gold transition-colors">{item.quantity}x</span>
                                    <span className="font-bold text-sm uppercase tracking-tight">{item.menu.name}</span>
                                </div>
                                <span className="font-black font-poppins text-sm tracking-tight">£{parseFloat(item.subtotal).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-royal-brown/5 pt-6 space-y-3">
                        <div className="flex justify-between text-xs font-bold text-royal-brown/40 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>£{parseFloat(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-royal-brown/40 uppercase tracking-widest">
                            <span>Tax (10%)</span>
                            <span>£{parseFloat(order.tax).toFixed(2)}</span>
                        </div>
                        {parseFloat(order.discount) > 0 && (
                            <div className="flex justify-between text-xs text-green-600 font-black uppercase tracking-widest">
                                <span>Discount</span>
                                <span>-£{parseFloat(order.discount).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-4xl font-black text-royal-spice mt-8 pt-8 border-t-2 border-dashed border-royal-brown/10 font-playfair">
                            <span className="uppercase tracking-tighter">Total</span>
                            <span className="">£{parseFloat(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="bg-royal-brown rounded-3xl shadow-2xl p-8 text-royal-cream border border-white/5">
                    <h2 className="text-3xl font-black mb-8 font-playfair uppercase tracking-tighter text-royal-gold">Process</h2>
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Payment Method</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['cash', 'card', 'digital'].map((method) => (
                                    <label
                                        key={method}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${data.payment_method === method
                                            ? 'border-royal-gold bg-royal-gold/10 scale-105'
                                            : 'border-white/5 bg-white/5 hover:border-royal-gold/20'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            className="hidden"
                                            name="payment_method"
                                            value={method}
                                            checked={data.payment_method === method}
                                            onChange={e => setData('payment_method', e.target.value)}
                                        />
                                        <span className="text-3xl mb-3 drop-shadow-xl">
                                            {method === 'cash' ? '💵' : method === 'card' ? '💳' : '📱'}
                                        </span>
                                        <span className={`font-black text-[9px] uppercase tracking-widest transition-colors ${data.payment_method === method ? 'text-royal-gold' : 'text-white/40'}`}>{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Payment Amount</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-royal-gold group-focus-within:scale-125 transition-transform">£</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="w-full pl-14 h-24 bg-white/5 rounded-3xl border-2 border-white/10 focus:border-royal-gold focus:ring-0 text-5xl font-poppins font-black text-white text-center transition-all"
                                />
                            </div>
                        </div>

                        {data.payment_method !== 'cash' && (
                            <div className="animate-in slide-in-from-top-4 duration-300">
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Transaction Reference</label>
                                <input
                                    type="text"
                                    placeholder="AUTH-CODE-0000"
                                    value={data.transaction_id}
                                    onChange={e => setData('transaction_id', e.target.value)}
                                    className="w-full h-16 bg-white/5 rounded-2xl border-2 border-white/10 focus:border-royal-gold focus:ring-0 font-bold px-6 text-royal-gold placeholder:text-white/10"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-royal-gold text-royal-brown font-black py-6 rounded-3xl hover:bg-amber-600 transition-all shadow-2xl text-xl uppercase tracking-[0.3em] disabled:opacity-20 disabled:grayscale mt-4"
                        >
                            {processing ? 'Processing...' : `Pay Total`}
                        </button>
                    </form>
                </div>
            </div>
        </POSLayout>
    );
}
