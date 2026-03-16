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
