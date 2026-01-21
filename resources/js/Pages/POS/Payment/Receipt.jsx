import { Head } from '@inertiajs/react';

export default function Receipt({ order }) {
    const printReceipt = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-royal-cream/10 py-10 font-poppins text-sm uppercase selection:bg-royal-gold selection:text-royal-brown">
            <Head title={`Receipt - ${order.order_number}`} />

            <div className="bg-white w-[380px] mx-auto p-10 shadow-2xl relative receipt-print border-t-[12px] border-royal-gold rounded-b-3xl">
                {/* Logo/Header */}
                <div className="text-center mb-10">
                    <div className="mb-4 text-4xl text-royal-gold">👑</div>
                    <h1 className="text-3xl font-playfair font-black text-royal-brown mb-2 tracking-tighter">INDIAN ROYAL DINE</h1>
                    <p className="text-[9px] font-black tracking-[0.2em] text-royal-brown/40">Exquisite Indian Cuisine</p>
                    <div className="my-8 border-b-2 border-dashed border-royal-brown/10"></div>
                    <h2 className="font-black text-royal-spice tracking-widest text-[10px]">OFFICIAL RECEIPT</h2>
                </div>

                {/* Order Details */}
                <div className="mb-8 space-y-2 text-[10px] font-bold text-royal-brown/60">
                    <div className="flex justify-between">
                        <span className="uppercase tracking-widest">Receipt No:</span>
                        <span className="text-royal-brown">{order.order_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="uppercase tracking-widest">Date & Time:</span>
                        <span className="text-royal-brown">{new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    {order.table && (
                        <div className="flex justify-between">
                            <span className="uppercase tracking-widest">Table:</span>
                            <span className="text-royal-brown">{order.table.table_number}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="uppercase tracking-widest">Server:</span>
                        <span className="text-royal-brown">{order.staff?.name || 'TERMINAL-01'}</span>
                    </div>
                </div>

                <div className="my-8 border-b-2 border-dashed border-royal-brown/10"></div>

                {/* Items */}
                <div className="mb-8">
                    <table className="w-full text-[10px]">
                        <thead>
                            <tr className="border-b border-royal-brown/10">
                                <th className="text-left pb-3 font-black uppercase tracking-widest text-royal-brown/40">Menu Item</th>
                                <th className="text-right pb-3 font-black uppercase tracking-widest text-royal-brown/40">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {order.order_items.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="py-4 pr-2">
                                        <div className="font-black text-royal-brown text-xs uppercase tracking-tight mb-1">{item.menu.name}</div>
                                        <div className="text-[9px] font-bold text-royal-brown/40">{item.quantity} x £{parseFloat(item.unit_price).toFixed(2)}</div>
                                    </td>
                                    <td className="text-right py-4 align-top font-black text-royal-brown text-xs">
                                        £{parseFloat(item.subtotal).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="my-8 border-b-2 border-dashed border-royal-brown/10"></div>

                {/* Totals */}
                <div className="space-y-3 mb-10">
                    <div className="flex justify-between text-[10px] font-bold text-royal-brown/40">
                        <span className="uppercase tracking-widest">Subtotal</span>
                        <span>£{parseFloat(order.subtotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-royal-brown/40">
                        <span className="uppercase tracking-widest">Service Tax (10%)</span>
                        <span>£{parseFloat(order.tax).toFixed(2)}</span>
                    </div>
                    {parseFloat(order.discount) > 0 && (
                        <div className="flex justify-between text-[10px] font-black text-green-600">
                            <span className="uppercase tracking-widest">Loyalty Discount</span>
                            <span>-£{parseFloat(order.discount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-2xl font-black mt-8 pt-8 border-t-2 border-royal-brown text-royal-brown font-playfair">
                        <span className="uppercase tracking-tighter">Grand Total</span>
                        <span className="text-royal-spice">£{parseFloat(order.total).toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-royal-cream/20 p-5 rounded-2xl mb-10 text-[9px] border border-royal-brown/5 text-center">
                    <p className="font-black mb-2 text-royal-brown uppercase tracking-widest">Payment Status: {order.payment_status?.toUpperCase() || 'PAID'}</p>
                    <p className="font-bold text-royal-brown/40 mb-1">Method: {order.payment_method?.toUpperCase() || 'CASH'}</p>
                    <p className="font-bold text-royal-brown/40">Ref: {order.order_number}</p>
                </div>

                <div className="text-center font-bold text-royal-brown">
                    <p className="font-playfair text-sm italic mb-2">Thank you for your royalty!</p>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-royal-brown/30">www.indianroyaldine.com</p>
                </div>
            </div>

            <div className="mt-12 flex justify-center space-x-6 no-print">
                <button
                    onClick={printReceipt}
                    className="bg-royal-gold text-royal-brown font-black px-10 py-4 rounded-2xl hover:bg-amber-600 transition shadow-2xl uppercase tracking-[0.2em] text-xs"
                >
                    Print Receipt
                </button>
                <button
                    onClick={() => window.location.href = route('pos.orders.index')}
                    className="bg-royal-brown text-royal-cream font-black px-10 py-4 rounded-2xl hover:bg-black transition shadow-2xl uppercase tracking-[0.2em] text-xs"
                >
                    New Order
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .bg-royal-cream { background: white !important; }
                    .bg-white { box-shadow: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; border: 0 !important; }
                    .receipt-print { border: none !important; }
                }
            `}} />
        </div>
    );
}
