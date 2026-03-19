// ─── Product Types ────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  nameEs: string;
  price: number;
  stock: number;
  isExclusiveDrop: boolean;
  imageUrl?: string;
}

export interface Glove {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string; // Django DecimalField is serialized as string
  stock: number;
  image: string;
  size: 'S' | 'M' | 'L' | 'XL';
  created_at: string;
}

// ─── Language ─────────────────────────────────────────────────────────────────

export type Lang = 'es' | 'en';

// ─── Feature Card ─────────────────────────────────────────────────────────────

export interface FeatureCard {
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  imageUrl: string;
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────

export interface NavLink {
  labelEs: string;
  labelEn: string;
  href: string;
}

// ─── Countdown ────────────────────────────────────────────────────────────────

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
