import { useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import type { Lang } from '../types';

interface CartDrawerProps {
  lang: Lang;
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

export default function CartDrawer({ lang }: CartDrawerProps) {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.cartItems);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.totalPrice());
  const totalItems = useCartStore((s) => s.totalItems());

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
                  {labels.title}
                </h2>
                {totalItems > 0 && (
                  <span className="text-xs font-mono text-zinc-500">
                    {totalItems} {totalItems === 1 ? labels.item : labels.items}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* ─── Item List ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
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
