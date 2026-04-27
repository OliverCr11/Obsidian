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

export interface Discount {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
}

interface CartStore {
  // State
  cartItems: CartItem[];
  isOpen: boolean;
  discount: Discount | null;

  // Computed (derived on every call — not stored)
  totalPrice: () => number;
  totalItems: () => number;
  getDiscountAmount: () => number;

  // Cart UI
  openCart:   () => void;
  closeCart:  () => void;
  toggleCart: () => void;

  // Cart CRUD
  addItem:        (item: Omit<CartItem, 'quantity'>) => void;
  removeItem:     (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart:      () => void;
  applyDiscount:  (discount: Discount) => void;
  removeDiscount: () => void;
}

// ─── Store Definition ──────────────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ────────────────────────────────────────
      cartItems: [],
      isOpen: false,
      discount: null,

      // ── Computed ─────────────────────────────────────────────
      totalPrice: () =>
        get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalItems: () =>
        get().cartItems.reduce((sum, i) => sum + i.quantity, 0),
        
      getDiscountAmount: () => {
        const { discount, totalPrice } = get();
        if (!discount) return 0;
        const sub = totalPrice();
        if (discount.type === 'PERCENTAGE') {
          return sub * (discount.value / 100);
        }
        return Math.min(discount.value, sub);
      },

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
        set((s) => {
          const newItems = s.cartItems.filter((i) => i.id !== id);
          return { cartItems: newItems, discount: newItems.length === 0 ? null : s.discount };
        }),

      /** Set an item's quantity directly (removes item if quantity ≤ 0). */
      updateQuantity: (id, quantity) =>
        set((s) => {
          const newItems = quantity <= 0
            ? s.cartItems.filter((i) => i.id !== id)
            : s.cartItems.map((i) =>
                i.id === id ? { ...i, quantity: Math.min(quantity, 10) } : i
              );
          return { cartItems: newItems, discount: newItems.length === 0 ? null : s.discount };
        }),

      /** Empty the entire cart. */
      clearCart: () => set({ cartItems: [], discount: null }),
      applyDiscount: (discount) => set({ discount }),
      removeDiscount: () => set({ discount: null }),
    }),
    {
      name: 'obsidian-cart',   // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the cart items array and discount
      partialize: (s) => ({ cartItems: s.cartItems, discount: s.discount }),
    }
  )
);
