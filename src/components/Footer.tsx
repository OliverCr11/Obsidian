import type { Lang } from '../types';
import { t } from '../i18n/translations';

interface FooterProps {
  lang: Lang;
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="relative border-t border-[#18181B] bg-obsidian-black py-16 px-4 overflow-hidden">
      {/* Top subtle glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-2xl font-black tracking-[0.3em] text-white uppercase"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textShadow: '0 0 30px rgba(139, 92, 246, 0.35)',
            }}
          >
            OBSIDIAN
          </span>
          <span className="text-xs font-mono tracking-widest text-zinc-600 uppercase">
            Absolute Leather. Dark Performance.
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
          <span className="text-kevin-base">📦</span>
          <span>{t(lang, 'footer.shipping')}</span>
          {lang === 'en' && <span className="text-zinc-600">/ Envíos a todo Ecuador</span>}
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* Legal */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-zinc-600 font-mono">
          <span>{t(lang, 'footer.copyright')}</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-400 transition-colors">
              {t(lang, 'footer.terms')}
            </a>
            <a href="#" className="hover:text-zinc-400 transition-colors">
              {t(lang, 'footer.privacy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
