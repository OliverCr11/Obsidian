// ─── Cart Types ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  nameEs: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  variant?: string;
}

