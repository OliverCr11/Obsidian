import { Shield, Flame, Crosshair } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Lang } from '../types';
import { t } from '../i18n/translations';

interface FeaturesProps {
  lang: Lang;
}

interface CardData {
  icon: ReactNode;
  titleKey: string;
  descKey: string;
  image: string;
  accentColor: string;
}

export default function Features({ lang }: FeaturesProps) {
  const cards: CardData[] = [
    {
      icon: <Shield size={28} strokeWidth={1.5} className="text-kevin-glow" />,
      titleKey: 'features.card1.title',
      descKey: 'features.card1.desc',
      image: '/images/feature_leather.png',
      accentColor: 'from-kevin-base/10 to-transparent',
    },
    {
      icon: <Flame size={28} strokeWidth={1.5} className="text-kevin-glow" />,
      titleKey: 'features.card2.title',
      descKey: 'features.card2.desc',
      image: '/images/feature_thermal.png',
      accentColor: 'from-kevin-base/10 to-transparent',
    },
    {
      icon: <Crosshair size={28} strokeWidth={1.5} className="text-kevin-glow" />,
      titleKey: 'features.card3.title',
      descKey: 'features.card3.desc',
      image: '/images/feature_grip.png',
      accentColor: 'from-kevin-base/10 to-transparent',
    },
  ];

  return (
    <section
      id="features"
      className="relative py-28 px-4 bg-obsidian-surface overflow-hidden"
      style={{ backgroundImage: "url('/images/texture_bg.jpg')", backgroundSize: 'cover', backgroundBlendMode: 'overlay' }}
    >
      {/* Background Noise/Texture Overlay */}
      <div className="absolute inset-0 bg-obsidian-surface/90 z-0 pointer-events-none" />

      {/* Violet ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 opacity-0 animate-[fade-in-up_0.8s_ease-out_0.1s_forwards]">
          <p className="text-kevin-base font-mono text-xs tracking-[0.3em] uppercase mb-3">
            Especificaciones / Specs
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            {t(lang, 'features.title')}
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            {t(lang, 'features.subtitle')}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="glass-feature rounded-xl overflow-hidden group cursor-default"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-zinc-900/50">
                <img
                  src={card.image}
                  alt={t(lang, card.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                />
                {/* Gradient overlay on image */}
                <div className={`absolute inset-0 bg-gradient-to-t ${card.accentColor}`} />
                {/* Icon overlay */}
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-lg bg-black/60 backdrop-blur-sm border border-kevin-base/20 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6">
                <h3 className="text-white font-bold text-lg mb-2 tracking-tight">
                  {t(lang, card.titleKey)}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {t(lang, card.descKey)}
                </p>

                {/* Subtle violet accent line */}
                <div className="mt-4 h-0.5 w-8 bg-kevin-base rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
