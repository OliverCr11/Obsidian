import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── CartItem Type ─────────────────────────────────────────────────────────────
// Matches the shape consumed by CartDrawer and the Hero pre-order button.

export interface CartItem {
  id: string;
  name: string;        // English display name
  nameEs: string;      // Spanish display name
  price: number;       // USD unit price
  quantity: number;
  image: string;       // path relative to /public
  size: string;        // e.g. "M", "L", "XL"
  variant?: string;    // optional full variant label e.g. "Talla M / Carbon Black"
}

// ─── Store Shape ───────────────────────────────────────────────────────────────

interface CartStore {
  // State
  cartItems: CartItem[];
  isOpen: boolean;

  // Computed (derived on every call — not stored)
  totalPrice: () => number;
  totalItems: () => number;

  // Cart UI
  openCart:   () => void;
  closeCart:  () => void;
  toggleCart: () => void;

  // Cart CRUD
  addItem:        (item: Omit<CartItem, 'quantity'>) => void;
  removeItem:     (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart:      () => void;
}

// ─── Store Definition ──────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────────
      cartItems: [
        {
          id: 'obd-glove-001-m',
          name: "Founder's Glove — Drop 001",
          nameEs: 'Guante Fundador — Lote 001',
          price: 120,
          quantity: 1,
          image: '/images/hero_glove.png',
          size: 'M',
          variant: 'Talla M / Carbon Black',
        },
      ],
      isOpen: false,

      // ── Computed ─────────────────────────────────────────────
      totalPrice: () =>
        get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalItems: () =>
        get().cartItems.reduce((sum, i) => sum + i.quantity, 0),

      // ── Cart UI ───────────────────────────────────────────────
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // ── Cart CRUD ─────────────────────────────────────────────

      /** Add a new item or increment its quantity if it already exists. */
      addItem: (item) =>
        set((s) => {
          const existing = s.cartItems.find((i) => i.id === item.id);
          if (existing) {
            return {
              cartItems: s.cartItems.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
                  : i
              ),
            };
          }
          return { cartItems: [...s.cartItems, { ...item, quantity: 1 }] };
        }),

      /** Completely remove an item from the cart. */
      removeItem: (id) =>
        set((s) => ({ cartItems: s.cartItems.filter((i) => i.id !== id) })),

      /** Set an item's quantity directly (removes item if quantity ≤ 0). */
      updateQuantity: (id, quantity) =>
        set((s) => ({
          cartItems:
            quantity <= 0
              ? s.cartItems.filter((i) => i.id !== id)
              : s.cartItems.map((i) =>
                  i.id === id ? { ...i, quantity: Math.min(quantity, 10) } : i
                ),
        })),

      /** Empty the entire cart. */
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'obsidian-cart',   // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the cart items array — isOpen resets to closed on refresh
      partialize: (s) => ({ cartItems: s.cartItems }),
    }
  )
);
