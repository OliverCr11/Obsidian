import { ArrowRight, Wind, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import type { Lang } from '../types';
import { useCartStore } from '../store/useCartStore';

interface HeroProps {
  lang: Lang;
}

export default function Hero({ lang }: HeroProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const features = [
    {
      icon: <Wind size={20} className="text-kevin-violet" />,
      title: "Urban Climate Control",
      text: "Wind-blocking Matte Cabretta Leather paired with our signature deep-violet micro-fiber lining. Retains natural heat without the bulk."
    },
    {
      icon: <Fingerprint size={20} className="text-kevin-violet" />,
      title: "Invisible Touch Technology",
      text: "Seamless screen interaction. Carbon-threaded fingertips hidden beneath the leather allow full control of your devices without breaking character."
    },
    {
      icon: <Lock size={20} className="text-kevin-violet" />,
      title: "ENGINEERED SCARCITY",
      text: "Only 50 units exist. Laser-engraved iridescent side-zipper. Vacuum-sealed tactical packaging. Once they are gone, Lot 001 is archived forever."
    }
  ];

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

          {/* ─── Left: Text & Features ─── */}
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            
            <div className="space-y-4">
              {/* Badge */}
              <div className="flex items-center gap-3">
                <span className="badge-glow inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] text-kevin-glow uppercase border border-kevin-violet/30 bg-kevin-violet/5">
                  <ShieldCheck size={14} />
                  DROP 001
                </span>
                <span className="text-zinc-600 text-xs font-mono tracking-widest uppercase">
                  Verified Authentic
                </span>
              </div>

              {/* H1 Title */}
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tighter text-white uppercase"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                THE SECOND SKIN.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
                  LOT 001.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg font-light">
                Dark luxury meets urban utility. The Founder's Drop is here. 
                <span className="text-white font-medium ml-1">Strictly limited to 50 pairs.</span>
              </p>
            </div>

            {/* Feature List */}
            <div className="flex flex-col gap-6 mt-2 max-w-xl">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  <div className="mt-1 w-10 h-10 rounded-lg bg-[#09090B] border border-kevin-violet/20 flex items-center justify-center shrink-0 group-hover:border-kevin-violet/50 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wide uppercase mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  addItem({
                    id: 'obd-lot-001',
                    name: "Founder's Glove — Lot 001",
                    nameEs: 'Guante Fundador — Lote 001',
                    price: 150,
                    image: '/images/hero_glove.png',
                    size: 'M',
                    variant: 'One Size / Carbon Black',
                  });
                  openCart();
                }}
                className="btn-primary animate-pulse-glow flex items-center gap-3 text-sm px-8 py-4 uppercase tracking-widest w-full sm:w-auto justify-center"
              >
                {lang === 'es' ? 'Pre-ordenar Ahora' : 'Pre-order Now'}
                <ArrowRight size={18} strokeWidth={2} />
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
            <div className="absolute top-10 left-0 md:left-10 glass rounded-lg px-4 py-2 border border-kevin-violet/30">
              <span className="text-white text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                1 of 50
              </span>
            </div>

            {/* Tagline floating bottom right */}
            <div className="absolute bottom-10 right-0 md:right-10 glass rounded-lg px-5 py-3 border border-zinc-800 backdrop-blur-md">
              <p className="text-zinc-400 text-[10px] font-mono tracking-widest uppercase">
                Obsidian Core Div. <br />
                <span className="text-kevin-violet font-bold">Absolute Leather.</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
