import { useEffect, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Lang, CountdownTime } from '../types';
import { t } from '../i18n/translations';
import { useCartStore } from '../store/useCartStore';

interface HeroProps {
  lang: Lang;
}

// Target date: 2 days, 14 hours, 35 mins, 59 secs from 2026-03-16T16:06:35
const TARGET_DATE = new Date('2026-03-18T06:42:34-04:00').getTime();

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
      <span className="countdown-digit text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
        {pad(value)}
      </span>
      <span className="text-[10px] sm:text-xs font-mono text-zinc-500 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

export default function Hero({ lang }: HeroProps) {
  const [time, setTime] = useState<CountdownTime>(getTimeLeft);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const tick = useCallback(() => {
    setTime(getTimeLeft());
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <section
      id="drop"
      className="relative min-h-screen flex items-center overflow-hidden bg-obsidian-black"
    >
      {/* ─── Ambient Background Effects ─── */}
      {/* Large violet glow behind hero image */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.13) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Subtle left ambient */}
      <div
        className="absolute left-0 bottom-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom-left, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ─── Left: Text & CTA ─── */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">

            {/* Badge */}
            <div className="flex items-center gap-3">
              <span className="badge-glow inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider text-kevin-glow uppercase">
                {t(lang, 'hero.badge')}
              </span>
              <span className="text-zinc-500 text-xs font-mono">
                {t(lang, 'hero.badge.sub')}
              </span>
            </div>

            {/* H1 Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {t(lang, 'hero.h1').split('. ').map((part, i, arr) => (
                <span key={i}>
                  {part}{i < arr.length - 1 && (
                    <>
                      .<br />
                    </>
                  )}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-md">
              {t(lang, 'hero.subtitle')}
            </p>

            {/* ─── Countdown Timer ─── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <DigitBlock value={time.days} label={t(lang, 'hero.countdown.days')} />
                <span className="text-zinc-500 font-mono text-2xl font-thin mt-[-1rem]">:</span>
                <DigitBlock value={time.hours} label={t(lang, 'hero.countdown.hours')} />
                <span className="text-zinc-500 font-mono text-2xl font-thin mt-[-1rem]">:</span>
                <DigitBlock value={time.minutes} label={t(lang, 'hero.countdown.mins')} />
                <span className="text-zinc-500 font-mono text-2xl font-thin mt-[-1rem]">:</span>
                <DigitBlock value={time.seconds} label={t(lang, 'hero.countdown.secs')} />
              </div>
            </div>

            {/* Stock warning */}
            <p className="text-zinc-500 text-sm font-mono">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 align-middle animate-pulse" />
              {t(lang, 'hero.stock', { n: 37 })}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={() => {
                  addItem({
                    id: 'obd-glove-001-m',
                    name: "Founder's Glove — Drop 001",
                    nameEs: 'Guante Fundador — Lote 001',
                    price: 120,
                    image: '/images/hero_glove.png',
                    size: 'M',
                    variant: 'Talla M / Carbon Black',
                  });
                  openCart();
                }}
                className="btn-primary animate-pulse-glow flex items-center gap-2 text-sm"
                aria-label="Pre-order gloves"
              >
                {t(lang, 'hero.cta')}
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ─── Right: Glove Image ─── */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 min-h-[320px]">
            {/* Radial violet glow behind glove */}
            <div
              className="absolute inset-0 m-auto pointer-events-none"
              style={{
                width: '80%',
                height: '80%',
                background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.22) 0%, transparent 65%)',
                filter: 'blur(40px)',
                borderRadius: '50%',
              }}
            />

            {/* Glove Image with float animation */}
            <div className="animate-float relative z-10 w-full max-w-[480px] mx-auto">
              <img
                src="/images/hero_glove.png"
                alt={lang === 'es' ? 'Guante de cuero premium Obsidian' : 'Obsidian premium leather glove'}
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 80px rgba(109, 40, 217, 0.2))',
                }}
              />
            </div>

            {/* Stats floating tag */}
            <div className="absolute bottom-4 right-4 glass rounded-lg px-4 py-3 flex flex-col items-end">
              <span className="text-white font-black text-xl font-mono">$120</span>
              <span className="text-zinc-500 text-xs font-mono tracking-widest">USD</span>
            </div>

            {/* "FOUNDERS" floating left tag */}
            <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
              <span className="text-kevin-glow text-[10px] font-mono font-bold tracking-widest uppercase">
                Founder's Ed.
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
