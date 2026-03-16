import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartState, CartAction } from '../types/cart';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: CartState = {
  isOpen: false,
  items: [
    // Pre-seed one item to match the nav badge already showing "1"
    {
      id: 'obd-glove-001-m',
      name: "Founder's Glove — Drop 001",
      nameEs: "Guante Fundador — Lote 001",
      variant: 'Talla M / Carbon Black',
      price: 120,
      quantity: 1,
      imageUrl: '/images/hero_glove.png',
    },
  ],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case 'INCREMENT':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
            : i
        ),
      };

    case 'DECREMENT':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      };

    default:
      return state;
  }
}

// ─── Context Definition ───────────────────────────────────────────────────────

interface CartContextValue {
  state: CartState;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const openCart   = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart  = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }), []);
  const increment  = useCallback((id: string) => dispatch({ type: 'INCREMENT', payload: { id } }), []);
  const decrement  = useCallback((id: string) => dispatch({ type: 'DECREMENT', payload: { id } }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ state, openCart, closeCart, toggleCart, removeItem, increment, decrement, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a <CartProvider>');
  return ctx;
}
