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

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Glove {
  id: number;
  name: string;
  name_es?: string;
  name_en?: string;
  slug: string;
  description: string;
  description_es?: string;
  description_en?: string;
  price: string;
  stock: number;
  images: ProductImage[];
  size: 'S' | 'M' | 'L' | 'XL';
  created_at: string;
  category?: string | null;
  collection_type: 'DROP' | 'CORE';
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
