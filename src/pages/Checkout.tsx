import { CreditCard, Truck, ChevronLeft, Lock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import type { Lang } from '../types';

interface CheckoutProps {
  lang: Lang;
  onBack: () => void;
  onSuccess: () => void; // Called when the user clicks 'PAY NOW'
}

const SHIPPING_RATE = 15.00;

export default function Checkout({ lang, onBack, onSuccess }: CheckoutProps) {
  const items = useCartStore((s) => s.cartItems);
  const subtotal = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  
  const total = subtotal + (items.length > 0 ? SHIPPING_RATE : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing...
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-obsidian-black text-obsidian-text py-12 px-4 sm:px-6 lg:px-8">
      
      {/* ─── Header ─── */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium mb-6"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {lang === 'es' ? 'Volver al carrito' : 'Back to cart'}
        </button>
        <h1 className="text-3xl font-black text-white tracking-tight">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* ─── LEFT: Form ─── */}
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-2xl border border-zinc-800/50 space-y-10">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-kevin-violet/20 flex items-center justify-center text-kevin-violet text-xs font-mono">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">First Name</label>
                    <input type="text" required className="input-dark w-full" placeholder="Kevin" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Last Name</label>
                    <input type="text" required className="input-dark w-full" placeholder="Smith" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email Address</label>
                  <input type="email" required className="input-dark w-full" placeholder="you@example.com" />
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* Shipping Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-kevin-violet/20 flex items-center justify-center text-kevin-violet text-xs font-mono">2</span>
                Shipping Address
                <Truck size={18} className="ml-auto text-zinc-500" />
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Street Address</label>
                  <input type="text" required className="input-dark w-full" placeholder="123 Performance Ave" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">City</label>
                    <input type="text" required className="input-dark w-full" placeholder="Quito" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">ZIP</label>
                    <input type="text" required className="input-dark w-full" placeholder="170102" />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-800/50" />

            {/* ─── PAYMENT SECTION (Stripe Redesign) ─── */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-kevin-violet/20 flex items-center justify-center text-kevin-violet text-xs font-mono">3</span>
                Payment
              </h2>

              {/* Express Checkout */}
              <div className="space-y-4 mb-8">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider text-center mb-3">
                  Express Checkout
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button type="button" className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded flex items-center justify-center transition-colors">
                    {/* Apple Pay Logo (using text/css for demo) */}
                    <span className="font-semibold text-lg flex items-center gap-1">
                      <span className="text-xl"></span> Pay
                    </span>
                  </button>
                  <button type="button" className="w-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white h-12 rounded flex items-center justify-center transition-colors relative overflow-hidden">
                    <span className="font-semibold text-lg">G Pay</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-zinc-800/50"></div>
                <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase tracking-wider font-medium">Or pay with card</span>
                <div className="flex-grow border-t border-zinc-800/50"></div>
              </div>
              
              {/* Stripe-like Unified Input */}
              <div className="mt-4">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2">Card Information</label>
                
                <div className="bg-[#121214] border border-zinc-800/80 rounded-lg overflow-hidden flex flex-col focus-within:border-kevin-violet transition-colors">
                  {/* Card Number */}
                  <div className="relative flex items-center px-3 h-11 border-b border-zinc-800/80">
                    <CreditCard size={18} className="text-zinc-500 mr-2" />
                    <input 
                      type="text" 
                      required 
                      className="w-full bg-transparent text-white font-mono text-sm outline-none placeholder:text-zinc-600" 
                      placeholder="Card number" 
                    />
                    <div className="flex gap-1 ml-2">
                      <div className="w-8 h-5 bg-zinc-800 rounded rounded-sm flex items-center justify-center text-[8px] font-bold text-zinc-400">VISA</div>
                      <div className="w-8 h-5 bg-zinc-800 rounded rounded-sm flex items-center justify-center text-[8px] font-bold text-zinc-400">MC</div>
                    </div>
                  </div>
                  
                  {/* Expiry & CVC */}
                  <div className="flex bg-[#121214]">
                    <div className="relative flex items-center px-4 h-11 border-r border-zinc-800/80 flex-1">
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-transparent text-white font-mono text-sm outline-none placeholder:text-zinc-600" 
                        placeholder="MM / YY" 
                      />
                    </div>
                    <div className="relative flex items-center px-4 h-11 flex-1">
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-transparent text-white font-mono text-sm outline-none placeholder:text-zinc-600" 
                        placeholder="CVC" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Lock size={12} />
                    <span>Secured by Stripe</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono">
                    TEST MODE
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary w-full py-4 text-base font-bold animate-pulse-glow mt-8">
              PAY ${total.toFixed(2)} USD
            </button>

          </form>
        </div>

        {/* ─── RIGHT: Order Summary ─── */}
        <div className="lg:col-span-5 sticky top-8">
          <div className="glass p-6 md:p-8 rounded-2xl border border-zinc-800/50">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6 scrollbar-hide max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/30">
                  <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4 className="text-sm font-bold text-white truncate">{lang === 'es' ? item.nameEs : item.name}</h4>
                    {item.variant && <p className="text-xs text-zinc-500 truncate mt-0.5">{item.variant}</p>}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-zinc-400">Qty: {item.quantity}</span>
                      <span className="text-sm font-mono font-bold text-white">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-zinc-500 text-sm italic">Your cart is empty.</p>
              )}
            </div>

            <div className="h-px bg-zinc-800/50 mb-6" />

            {/* Totals */}
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping Base Rate</span>
                <span className="text-white">${items.length > 0 ? SHIPPING_RATE.toFixed(2) : '0.00'}</span>
              </div>
              
              <div className="h-px bg-zinc-800/30 my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-base">Total</span>
                <div className="text-right">
                  <span className="text-kevin-glow font-black text-2xl">${total.toFixed(2)}</span>
                  <span className="text-zinc-500 text-xs ml-1">USD</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
