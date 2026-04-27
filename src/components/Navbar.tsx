import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lang } from '../types';
import { useCartStore } from '../store/useCartStore';

interface NavbarProps {
  lang: Lang;
  onToggleLang: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ lang, onToggleLang, onOpenAuth }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems());

  const navLinks = [
    { key: 'DROPS', href: '/drops' },
    { key: 'CORE', href: '/core' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#18181B]/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* ─── Logo ─── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span
            className="text-xl font-black tracking-[0.25em] text-white uppercase"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
            }}
          >
            OBSIDIAN
          </span>
          <span className="hidden sm:inline-block text-[10px] text-kevin-base font-mono tracking-widest border border-[#8A2BE2]/40 px-1.5 py-0.5 rounded text-[#8A2BE2]">
            BETA
          </span>
        </Link>

        {/* ─── Center Links (Desktop) ─── */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.key} to={link.href} className="text-zinc-400 hover:text-white transition-colors font-bold tracking-widest text-sm">
              {link.key}
            </Link>
          ))}
        </div>

        {/* ─── Right Actions ─── */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="hidden sm:flex items-center gap-1 text-xs font-mono font-semibold tracking-widest"
            aria-label="Toggle language"
          >
            <span className={lang === 'es' ? 'text-white' : 'text-zinc-500'}>ES</span>
            <span className="text-zinc-600 mx-0.5">/</span>
            <span className={lang === 'en' ? 'text-white' : 'text-zinc-500'}>EN</span>
          </button>

          {/* User Icon → opens Auth */}
          <button
            onClick={onOpenAuth}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            aria-label="User profile"
          >
            <User size={18} strokeWidth={1.5} />
          </button>

          {/* Cart Icon with dynamic badge */}
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-kevin-base rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ─── Mobile Menu ─── */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-[#18181B] px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              className="text-white font-bold tracking-widest py-2 active:bg-zinc-800"
              onClick={() => setMobileOpen(false)}
            >
              {link.key}
            </Link>
          ))}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-2 text-xs font-mono font-semibold tracking-widest py-2"
          >
            <span className={lang === 'es' ? 'text-white' : 'text-zinc-500'}>ES</span>
            <span className="text-zinc-600">/</span>
            <span className={lang === 'en' ? 'text-white' : 'text-zinc-500'}>EN</span>
          </button>
        </div>
      )}
    </header>
  );
}
