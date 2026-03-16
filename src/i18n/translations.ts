import type { Lang } from '../types';

// ─── Translation Dictionary ───────────────────────────────────────────────────

export const translations: Record<Lang, Record<string, string>> = {
  es: {
    // Navbar
    'nav.drop': 'Drop 001',
    'nav.collection': 'Colección Core',
    'nav.story': 'La Historia',
    // Hero
    'hero.badge': '🔴 LOTE 001 — EDICIÓN FUNDADOR',
    'hero.badge.sub': 'Solo 50 pares',
    'hero.h1': 'Rendimiento Oscuro. Cuero Absoluto.',
    'hero.subtitle': 'Diseñado para el asfalto. Nacido en el centro del mundo.',
    'hero.countdown.days': 'Días',
    'hero.countdown.hours': 'Horas',
    'hero.countdown.mins': 'Min',
    'hero.countdown.secs': 'Seg',
    'hero.cta': 'Pre-ordenar Ahora — $120.00',
    'hero.stock': 'Solo quedan {n} pares. No pierdas tu lugar.',
    // Features
    'features.title': 'Ingeniería de Alto Rendimiento',
    'features.subtitle': 'Cada detalle diseñado para el rider exigente.',
    'features.card1.title': 'Cuero Ecuatoriano Premium',
    'features.card1.desc': 'Grano entero seleccionado a mano. La materia prima más resistente del hemisferio.',
    'features.card2.title': 'Protección Térmica',
    'features.card2.desc': 'Aislamiento avanzado de capa intermedia para rutas nocturnas extremas.',
    'features.card3.title': 'Agarre Táctico',
    'features.card3.desc': 'Control absoluto sobre el asfalto. Grip moldeado para aceleración precisa.',
    // Footer
    'footer.shipping': 'Envíos a todo Ecuador',
    'footer.copyright': '© 2026 Obsidian. Todos los derechos reservados.',
    'footer.terms': 'Términos',
    'footer.privacy': 'Privacidad',
  },
  en: {
    // Navbar
    'nav.drop': 'Drop 001',
    'nav.collection': 'Core Collection',
    'nav.story': 'The Story',
    // Hero
    'hero.badge': '🔴 LOT 001 — FOUNDER\'S EDITION',
    'hero.badge.sub': 'Only 50 pairs',
    'hero.h1': 'Dark Performance. Absolute Leather.',
    'hero.subtitle': 'Engineered for asphalt. Born at the center of the world.',
    'hero.countdown.days': 'Days',
    'hero.countdown.hours': 'Hours',
    'hero.countdown.mins': 'Min',
    'hero.countdown.secs': 'Sec',
    'hero.cta': 'Pre-Order Now — $120.00',
    'hero.stock': 'Only {n} pairs left. Secure your spot.',
    // Features
    'features.title': 'High-Performance Engineering',
    'features.subtitle': 'Every detail engineered for the demanding rider.',
    'features.card1.title': 'Premium Ecuadorian Leather',
    'features.card1.desc': 'Hand-selected full-grain. The finest raw material in the hemisphere.',
    'features.card2.title': 'Thermal Protection',
    'features.card2.desc': 'Advanced mid-layer insulation for extreme night riding conditions.',
    'features.card3.title': 'Tactical Grip',
    'features.card3.desc': 'Absolute control over asphalt. Molded grip for precise throttle response.',
    // Footer
    'footer.shipping': 'Shipping across Ecuador',
    'footer.copyright': '© 2026 Obsidian. All rights reserved.',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
  },
};

export const t = (lang: Lang, key: string, vars?: Record<string, string | number>): string => {
  let text = translations[lang][key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
};
