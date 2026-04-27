import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { Lang, CountdownTime } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useProducts } from '../hooks/useProducts';
import { t } from '../i18n/translations';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface HeroProps {
  lang: Lang;
}

// Target date: 48 hours from now for the drop urgency
const TARGET_DATE = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).getTime();

function getTimeLeft(): CountdownTime {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

interface DigitBlockProps {
  value: number;
  label: string;
}

function DigitBlock({ value, label }: DigitBlockProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="glass px-4 py-3 rounded-xl border border-kevin-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
        <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
          {pad(value)}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-mono text-kevin-violet tracking-[0.2em] uppercase font-bold mt-2">
        {label}
      </span>
    </div>
  );
}

export default function Hero({ lang }: HeroProps) {
  const [time, setTime] = useState<CountdownTime>(getTimeLeft);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  
  // Destructure 'products' to log it as requested by the prompt
  const { products, dropProduct, loading } = useProducts();

  const getDisplayImage = (product: any) => {
    if (!product) return '/images/hero_glove.png';
    const path = product.images?.find((img: any) => img.is_primary)?.image || product.images?.[0]?.image;
    if (!path) return '/images/hero_glove.png';
    return path.startsWith('http') ? path : `${baseURL}${path}`;
  };
  
  // Wrapped in useEffect to prevent the countdown timer from spamming the console
  useEffect(() => {
    if (products.length > 0) {
      console.log("API Products:", products);
    }
  }, [products]);

  const tick = useCallback(() => {
    setTime(getTimeLeft());
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-obsidian-black pt-24 pb-16"
    >
      {/* ─── Ambient Background Effects ─── */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ─── Left: Text & CTA ─── */}
          <div className="flex flex-col gap-10 order-2 lg:order-1">
            
            <div className="space-y-6">
              {/* Badge */}
              <div className="flex items-center gap-3">
                <span className="badge-glow inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
                  <ShieldCheck size={14} />
                  {t(lang, 'hero.badge.active')}
                </span>
                <span className="text-zinc-600 text-xs font-mono tracking-widest uppercase">
                  {t(lang, 'hero.badge.verified')}
                </span>
              </div>

              {/* H1 Title */}
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter text-white uppercase"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {t(lang, 'hero.h1.part1')}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                  {t(lang, 'hero.h1.part2')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg font-light">
                {t(lang, 'hero.subtitle.main')} 
                <span className="text-white font-medium ml-1">{t(lang, 'hero.subtitle.highlight')}</span>
              </p>
            </div>

            {/* ─── Neon Countdown Timer ─── */}
            <div className="flex items-center gap-2 sm:gap-4 mt-2">
              <DigitBlock value={time.days} label={t(lang, 'hero.countdown.days')} />
              <span className="text-kevin-violet font-mono text-3xl font-thin pb-6 animate-pulse">:</span>
              <DigitBlock value={time.hours} label={t(lang, 'hero.countdown.hours')} />
              <span className="text-kevin-violet font-mono text-3xl font-thin pb-6 animate-pulse">:</span>
              <DigitBlock value={time.minutes} label={t(lang, 'hero.countdown.mins')} />
              <span className="text-kevin-violet font-mono text-3xl font-thin pb-6 animate-pulse">:</span>
              <DigitBlock value={time.seconds} label={t(lang, 'hero.countdown.secs')} />
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                disabled={loading || !dropProduct || dropProduct.stock <= 0}
                onClick={() => {
                  if (!dropProduct) return;
                  addItem({
                    id: `db-drop-${dropProduct.id}`,
                    name: lang === 'es' ? dropProduct.name_es || dropProduct.name : dropProduct.name_en || dropProduct.name,
                    nameEs: dropProduct.name_es || dropProduct.name,
                    price: Number(dropProduct.price),
                    quantity: 1,
                    image: dropProduct.images?.[0]?.image_url || '/images/hero_glove.png',
                    size: 'M',
                    variant: `Talla M / ${dropProduct.name}`
                  });
                  openCart();
                }}
                className="btn-primary animate-pulse-glow flex items-center gap-3 px-10 py-5 text-base font-bold uppercase tracking-[0.2em] w-full sm:w-auto justify-center bg-white text-black hover:bg-zinc-200 transition-colors rounded disabled:opacity-50"
              >
                {t(lang, 'hero.cta.preorder')}
                {dropProduct && <span className="text-zinc-500 font-mono ml-2">— ${parseFloat(dropProduct.price).toFixed(2)}</span>}
                <ArrowRight size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ─── Right: Glove Image ─── */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 h-[50vh] lg:h-auto min-h-[400px]">
            {/* Radial violet glow behind glove */}
            <div
              className="absolute inset-0 m-auto pointer-events-none"
              style={{
                width: '70%',
                height: '70%',
                background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
                filter: 'blur(50px)',
                borderRadius: '50%',
              }}
            />

            {/* Glove Image with float animation */}
            <div className="animate-float relative z-10 w-full max-w-[550px] mx-auto">
              <img
                src="/images/hero_glove.png"
                alt="Obsidian Lot 001 Glove"
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 80px rgba(109, 40, 217, 0.2))',
                }}
              />
            </div>

            {/* "1 OF 50" floating left tag */}
            <div className="absolute top-10 left-0 md:left-10 glass rounded-lg px-4 py-2 border border-emerald-500/30">
              <span className="text-white text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                {dropProduct ? `${dropProduct.stock} ${lang === 'es' ? 'DISPONIBLES' : 'LEFT'}` : t(lang, 'hero.limit.badge')}
              </span>
            </div>

            {/* Tagline floating bottom right */}
            <div className="absolute bottom-10 right-0 md:right-10 glass rounded-lg px-5 py-3 border border-zinc-800 backdrop-blur-md">
              <p className="text-zinc-400 text-[10px] font-mono tracking-widest uppercase">
                {t(lang, 'hero.tagline.div')} <br />
                <span className="text-kevin-violet font-bold">{t(lang, 'hero.tagline.leather')}</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
