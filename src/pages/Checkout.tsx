import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ChevronLeft, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import CouponInput from '../components/CouponInput';
import type { Lang } from '../types';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QoaeXCopJNIOyykNdIMQb5VPLNSNu3odo5WFE21ToLhJUd64sWUVl4n1z4F0aZxUjJWcvO3JJzoFtyCB22eCjQz00YIJfK0d2');

export interface CheckoutProps {
  lang: Lang;
  onBack: () => void;
  onSuccess: (data?: any) => void;
}

const SHIPPING_RATE = 15.00;

// Stripe Elements default premium Dark Theme configuration
export const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    colorPrimary: '#8A2BE2',
    colorBackground: '#09090B',
    colorText: '#E4E4E7',
    colorDanger: '#ef4444',
    spacingUnit: '4px',
    borderRadius: '8px',
    colorTextPlaceholder: '#71717a', // zinc-500
  },
  rules: {
    '.Input': {
      border: '1px solid #27272a', // zinc-800
      boxShadow: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    '.Input:focus': {
      border: '1px solid #8A2BE2',
      boxShadow: '0 0 10px rgba(138,43,226,0.3)',
      outline: 'none',
    },
  }
};

function CheckoutFormInternal({ lang, onBack, onSuccess }: CheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const items = useCartStore((s) => s.cartItems);
  const subtotal = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  const clearCart = useCartStore((s: any) => s.clearCart || (() => {}));
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  
  const discount = useCartStore((s: any) => s.discount);
  const discountAmount = useCartStore((s: any) => s.getDiscountAmount());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const finalSubtotal = subtotal - discountAmount;
  const total = finalSubtotal + (items.length > 0 ? SHIPPING_RATE : 0);

  const validateForm = (formData: FormData): string | null => {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const zip = formData.get('zip') as string;

    if (!firstName?.trim() || !lastName?.trim()) return "First and Last name are required.";
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please provide a valid email address.";
    if (!address?.trim()) return "Street Address is required.";
    if (!city?.trim()) return "City is required.";
    if (!zip?.trim()) return "ZIP Code is required.";
    
    return null;
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const validationError = validateForm(formData);
    
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }
    
    const payload = {
      full_name: `${formData.get('firstName')} ${formData.get('lastName')}`.trim(),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      total_paid: total,
      coupon_code: discount?.code || null,
      items: items.map(item => ({
        glove: parseInt(item.id.replace(/\D/g, ''), 10) || parseInt(item.id, 10),
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      // 1. Fetch the Payment Intent
      const intentRes = await api.post('/orders/create-payment-intent/', payload);
      const { client_secret } = intentRes.data;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Stripe Form rendering failed.");

      // 2. Confirm Payment via Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: payload.full_name,
            email: payload.email as string,
            address: {
              line1: payload.address as string,
              city: payload.city as string,
              postal_code: formData.get('zip') as string,
            }
          }
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message || "Payment declined by issuing bank.");
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 3. Finalize Order Creation in Django
        const res = await api.post('/orders/create/', payload);
        clearCart();
        setSuccessOrder(res.data);
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(lang === 'es' ? 'Su sesión expiró. Inicie sesión nuevamente.' : 'Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.detail || err.message || (lang === 'es' ? 'Hubo un error procesando su orden.' : 'Error processing your order.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successOrder) {
    return (
      <div className="min-h-screen bg-obsidian-black flex items-center justify-center p-4">
        <div className="glass max-w-lg w-full p-10 rounded-2xl border border-kevin-violet/30 text-center shadow-[0_0_40px_rgba(138,43,226,0.15)] flex flex-col items-center">
          <div className="w-20 h-20 bg-kevin-violet/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-kevin-violet" />
          </div>
          <h2 className="text-2xl font-black text-white font-mono tracking-widest uppercase mb-2">Transmission Confirmed</h2>
          <p className="text-zinc-400 mb-8 max-w-[80%] leading-relaxed text-sm">
            Operation successful. Secure instructions and tracking payload have been dispatched to <span className="text-white font-semibold">{successOrder.email}</span>.
          </p>
          <div className="w-full bg-[#09090B] border border-zinc-800/80 rounded-xl p-6 mb-8 text-left">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-1">Order Identifier</p>
            <p className="text-kevin-violet font-mono text-lg">{successOrder.order_id?.split('-')[0].toUpperCase()}</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="w-full py-4 text-sm font-bold uppercase tracking-widest text-[#E4E4E7] bg-white/5 hover:bg-white/10 rounded-xl transition-all font-mono border border-zinc-700">
            Access The Vault
          </button>
        </div>
      </div>
    );
  }

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
          <form onSubmit={handleOrderSubmit} className="bg-[#09090B]/60 backdrop-blur-md border border-zinc-800/80 p-8 md:p-10 rounded-2xl space-y-12 shadow-2xl">
            
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-kevin-violet/20 border border-kevin-violet/40 flex items-center justify-center text-kevin-violet text-xs font-mono shadow-[0_0_10px_rgba(138,43,226,0.2)]">1</span>
                Contact Information
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">First Name</label>
                    <input name="firstName" type="text" required className="w-full bg-[#09090B] border border-zinc-800 text-[#E4E4E7] placeholder:text-zinc-600 px-4 py-3 rounded-lg focus:border-[#8A2BE2] focus:outline-none focus:ring-0 focus:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all" defaultValue={user?.name?.split(' ')[0] || ''} placeholder="Kevin" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Last Name</label>
                    <input name="lastName" type="text" required className="w-full bg-[#09090B] border border-zinc-800 text-[#E4E4E7] placeholder:text-zinc-600 px-4 py-3 rounded-lg focus:border-[#8A2BE2] focus:outline-none focus:ring-0 focus:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} placeholder="Smith" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Email Address</label>
                  <input name="email" type="email" required className="w-full bg-[#09090B] border border-zinc-800 text-[#E4E4E7] placeholder:text-zinc-600 px-4 py-3 rounded-lg focus:border-[#8A2BE2] focus:outline-none focus:ring-0 focus:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all" defaultValue={user?.email || ''} placeholder="you@example.com" />
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-800/80" />

            {/* Shipping Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-kevin-violet/20 border border-kevin-violet/40 flex items-center justify-center text-kevin-violet text-xs font-mono shadow-[0_0_10px_rgba(138,43,226,0.2)]">2</span>
                Shipping Address
                <Truck size={18} className="ml-auto text-zinc-500" />
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Street Address</label>
                  <input name="address" type="text" required className="w-full bg-[#09090B] border border-zinc-800 text-[#E4E4E7] placeholder:text-zinc-600 px-4 py-3 rounded-lg focus:border-[#8A2BE2] focus:outline-none focus:ring-0 focus:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all" placeholder="123 Performance Ave" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">City</label>
                    <input name="city" type="text" required className="w-full bg-[#09090B] border border-zinc-800 text-[#E4E4E7] placeholder:text-zinc-600 px-4 py-3 rounded-lg focus:border-[#8A2BE2] focus:outline-none focus:ring-0 focus:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all" placeholder="Quito" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">ZIP</label>
                    <input name="zip" type="text" required className="w-full bg-[#09090B] border border-zinc-800 text-[#E4E4E7] placeholder:text-zinc-600 px-4 py-3 rounded-lg focus:border-[#8A2BE2] focus:outline-none focus:ring-0 focus:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all font-mono" placeholder="170102" />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-800/80" />

            {/* ─── PAYMENT SECTION (Stripe Redesign) ─── */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-kevin-violet/20 border border-kevin-violet/40 flex items-center justify-center text-kevin-violet text-xs font-mono shadow-[0_0_10px_rgba(138,43,226,0.2)]">3</span>
                Payment
              </h2>

              {/* Stripe-like Unified Input */}
              <div className="mt-4">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-3">Card Information</label>
                
                <div className="bg-[#09090B] border border-zinc-800 rounded-lg overflow-hidden flex flex-col focus-within:border-kevin-violet focus-within:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all p-4">
                  <CardElement options={{
                      style: {
                        base: {
                          iconColor: '#8A2BE2',
                          color: '#E4E4E7',
                          fontWeight: '500',
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          fontSize: '15px',
                          fontSmoothing: 'antialiased',
                          ':-webkit-autofill': { color: '#fce883' },
                          '::placeholder': { color: '#71717a' },
                        },
                        invalid: {
                          iconColor: '#ef4444',
                          color: '#ef4444',
                        },
                      },
                      hidePostalCode: true,
                    }} 
                  />
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
                    <Lock size={12} className="text-[#8A2BE2]/70" />
                    <span>Secured by Stripe</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono tracking-widest bg-zinc-900/50 px-2 py-0.5 rounded border border-zinc-800/50">
                    TEST MODE
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {error && (
              <div className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-3 rounded-lg text-sm font-mono mt-6 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                {error}
              </div>
            )}
            <button 
              disabled={isSubmitting || items.length === 0} 
              type="submit" 
              className="w-full py-4 mt-8 rounded-xl text-sm font-bold tracking-widest uppercase text-white bg-gradient-to-r from-[#8A2BE2]/80 to-purple-600/80 hover:from-[#8A2BE2] hover:to-purple-600 backdrop-blur-md border border-[#8A2BE2]/50 shadow-[0_0_20px_rgba(138,43,226,0.25)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  PROCESSING TRANSACTION...
                </>
              ) : (
                <span className="font-mono">PAY ${total.toFixed(2)} USD</span>
              )}
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
              <div className="mb-6">
                <CouponInput />
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#39FF14]">
                  <span>Discount ({discount?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              
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

export default function Checkout(props: CheckoutProps) {
  return (
    <Elements stripe={stripePromise} options={{ appearance: stripeAppearance }}>
      <CheckoutFormInternal {...props} />
    </Elements>
  );
}
