import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import type { Lang } from '../types';

interface CartDrawerProps {
  lang: Lang;
  onCheckout?: () => void;
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 32, mass: 0.9 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// Per-item variant — custom factory via motion `custom` prop
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' as const },
  }),
  exit: { opacity: 0, x: 40, transition: { duration: 0.2 } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CartDrawer({ lang, onCheckout }: CartDrawerProps) {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.cartItems);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());
  // Assuming a clearCart method exists, otherwise we mock it or fallback
  const clearCart = useCartStore((s: any) => s.clearCart || (() => {}));

  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setCheckoutStatus('loading');
    
    const orderData = {
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      total_paid: subtotal,
      items: items.map(item => ({
        // Strip string prefixes to retrieve the pure database ID
        glove: parseInt(item.id.replace(/\D/g, ''), 10),
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.status === 201) {
        setCheckoutStatus('success');
        clearCart();
        setTimeout(() => {
          closeCart();
          setIsCheckoutMode(false);
          setCheckoutStatus('idle');
          if (onCheckout) onCheckout();
        }, 3000);
      } else {
        setCheckoutStatus('error');
      }
    } catch (err) {
      console.error(err);
      setCheckoutStatus('error');
    }
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const labels = {
    title:      lang === 'es' ? 'Tu Carrito' : 'Your Cart',
    empty:      lang === 'es' ? 'Tu carrito está vacío.' : 'Your cart is empty.',
    shopNow:    lang === 'es' ? 'Ver Colección' : 'Shop Now',
    subtotal:   lang === 'es' ? 'Subtotal' : 'Subtotal',
    checkout:   lang === 'es' ? 'PROCEDER AL PAGO' : 'CHECKOUT',
    shipping:   lang === 'es' ? 'Envío calculado al pagar' : 'Shipping calculated at checkout',
    item:       lang === 'es' ? 'artículo' : 'item',
    items:      lang === 'es' ? 'artículos' : 'items',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Dark backdrop overlay ── */}
          <motion.div
            key="cart-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* ── Drawer Panel ── */}
          <motion.aside
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              'fixed top-0 right-0 z-[70] h-full',
              'w-full sm:w-[420px]',          // Full width mobile, fixed on desktop
              'flex flex-col',
              'bg-black/90 backdrop-blur-xl',  // Glassmorphism
              'border-l-2 border-kevin-base',  // Kevin Violet border
              'shadow-[−20px_0_80px_rgba(139,92,246,0.12)]',
            ].join(' ')}
            style={{ boxShadow: '-20px 0 80px rgba(139, 92, 246, 0.12)' }}
          >

            {/* ─── Header ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} strokeWidth={1.5} className="text-kevin-base" />
                <h2 className="text-white font-bold text-lg tracking-tight">
                  {isCheckoutMode ? (lang === 'es' ? 'Pago Seguro' : 'Secure Checkout') : labels.title}
                </h2>
                {!isCheckoutMode && totalItems > 0 && (
                  <span className="text-xs font-mono text-zinc-500">
                    {totalItems} {totalItems === 1 ? labels.item : labels.items}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  if (isCheckoutMode && checkoutStatus !== 'success') {
                    setIsCheckoutMode(false);
                    setCheckoutStatus('idle');
                  } else {
                    closeCart();
                  }
                }}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* ─── Body ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {isCheckoutMode ? (
                  checkoutStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center py-20"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                        <ShoppingBag size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed</h3>
                      <p className="text-zinc-400 text-sm">Your tactical gear is being prepared.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="checkout-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleCheckout}
                      className="flex flex-col gap-4"
                    >
                      {checkoutStatus === 'error' && (
                        <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm font-bold border border-red-500/50">
                          Transaction failed. Please verify data and try again.
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Shipping Details</label>
                        <input required name="fullName" type="text" placeholder="Full Name" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-kevin-violet transition-colors" />
                        <input required name="email" type="email" placeholder="Email Address" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-kevin-violet transition-colors" />
                        <input required name="address" type="text" placeholder="Street Address" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-kevin-violet transition-colors" />
                        <input required name="city" type="text" placeholder="City" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-kevin-violet transition-colors" />
                      </div>

                      <button
                        type="submit"
                        disabled={checkoutStatus === 'loading'}
                        className="mt-6 w-full py-4 rounded-lg font-black text-sm tracking-[0.12em] uppercase text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                        style={{
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                          boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                        }}
                      >
                        {checkoutStatus === 'loading' ? 'Authenticating...' : `Pay $${subtotal.toFixed(2)}`}
                      </button>
                    </motion.form>
                  )
                ) : items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-6 py-20 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                      <ShoppingBag size={32} strokeWidth={1} className="text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">{labels.empty}</p>
                      <button
                        onClick={closeCart}
                        className="text-kevin-glow text-sm font-medium hover:underline transition-colors"
                      >
                        {labels.shopNow} →
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="group relative flex gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/50 hover:border-zinc-700/60 transition-colors"
                    >
                      {/* Thumbnail */}
                        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/40">
                        <img
                          src={item.image}
                          alt={lang === 'es' ? item.nameEs : item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-white text-sm font-semibold truncate leading-snug">
                            {lang === 'es' ? item.nameEs : item.name}
                          </p>
                          <p className="text-zinc-500 text-xs mt-0.5 font-mono">
                            {item.variant}
                          </p>
                        </div>

                        {/* Qty + Price Row */}
                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-1 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} strokeWidth={2.5} />
                            </button>
                            <span className="text-white text-sm font-mono font-bold min-w-[1.25rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-white font-bold font-mono text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove button — appears on hover */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* ─── Footer ──────────────────────────────────────────────── */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-zinc-800/60 space-y-4">
                {/* Subtotal row */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">{labels.subtotal}</span>
                  <span className="text-white font-black font-mono text-xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Shipping note */}
                <p className="text-zinc-600 text-xs font-mono text-center">
                  {labels.shipping}
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

                {/* Checkout CTA */}
                <button
                  onClick={() => setIsCheckoutMode(true)}
                  className="w-full py-4 rounded-lg font-black text-sm tracking-[0.12em] uppercase text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    animation: 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  {labels.checkout} — ${subtotal.toFixed(2)}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
