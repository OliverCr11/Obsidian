import type { Lang } from '../types';

// ─── Translation Dictionary ───────────────────────────────────────────────────

export const translations: Record<Lang, Record<string, string>> = {
  es: {
    // Navbar
    'nav.drop': 'Drop 001',
    'nav.collection': 'Colección Core',
    'nav.story': 'La Historia',
    // Hero
    'hero.badge.active': 'DROP 001 ACTIVO',
    'hero.badge.verified': 'AUTENTICIDAD VERIFICADA',
    'hero.h1.part1': 'LA SEGUNDA PIEL.',
    'hero.h1.part2': 'LOTE 001.',
    'hero.subtitle.main': 'Lujo oscuro y utilidad urbana. El Founder\'s Drop está aquí.',
    'hero.subtitle.highlight': 'Estrictamente limitado a 50 pares.',
    'hero.countdown.days': 'DÍAS',
    'hero.countdown.hours': 'HORAS',
    'hero.countdown.mins': 'MINS',
    'hero.countdown.secs': 'SEGS',
    'hero.cta.preorder': 'PRE-ORDENAR AHORA',
    'hero.limit.badge': '1 de 50',
    'hero.tagline.div': 'Obsidian Core Div.',
    'hero.tagline.leather': 'Cuero Absoluto.',
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
    'hero.badge.active': 'DROP 001 ACTIVE',
    'hero.badge.verified': 'VERIFIED AUTHENTIC',
    'hero.h1.part1': 'THE SECOND SKIN.',
    'hero.h1.part2': 'LOT 001.',
    'hero.subtitle.main': 'Dark luxury meets urban utility. The Founder\'s Drop is here.',
    'hero.subtitle.highlight': 'Strictly limited to 50 pairs.',
    'hero.countdown.days': 'DAYS',
    'hero.countdown.hours': 'HOURS',
    'hero.countdown.mins': 'MINS',
    'hero.countdown.secs': 'SECS',
    'hero.cta.preorder': 'PRE-ORDER NOW',
    'hero.limit.badge': '1 of 50',
    'hero.tagline.div': 'Obsidian Core Div.',
    'hero.tagline.leather': 'Absolute Leather.',
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
