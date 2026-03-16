// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  nameEs: string;
  variant: string;        // e.g. "Talla M / Negro"
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type CartAction =
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'INCREMENT'; payload: { id: string } }
  | { type: 'DECREMENT'; payload: { id: string } };
