import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCartStore } from '../store/useCartStore';

interface HeroData {
  id: string | number;
  name: string;
  description: string;
  price: string;
  hero_title_over_the_product: string;
  hero_marketing_description: string;
  limited_drop_info_text: string;
  countdown_target_date: string;
  image_url: string;
}

export default function MainDropHero() {
  const [data, setData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleAddToCart = () => {
    if (!data) return;
    addItem({
      id: String(data.id),
      name: data.name,
      nameEs: data.name,
      price: parseFloat(data.price),
      image: data.image_url,
      size: 'M',
      variant: 'Edición Limitada'
    });
    openCart();
  };

  // Parallax setup for a premium 3D feeling
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  useEffect(() => {
    const fetchDrop = async () => {
      try {
        const res = await api.get('/active-hero-drop/');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch hero drop data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDrop();
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-[#000000] border-b border-[#181818]">
        <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">Encrypting Signal...</p>
      </div>
    );
  }

  if (error || !data) {
    return null; // Fail gracefully, layout naturally hides this block
  }

  return (
    <div className="relative w-full min-h-[90vh] bg-[#000000] border-b border-[#181818] flex items-center justify-center overflow-hidden px-6 lg:px-20 py-20 font-sans">
      
      {/* Background Visual Noise */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center max-w-7xl w-full z-10 relative">
        
        {/* Left Content Area */}
        <div className="flex flex-col items-start gap-8 z-20">
          
          {/* Badges */}
          <div className="flex flex-wrap gap-4">
            <span className="inline-block px-3 py-1 bg-[#00FFAA]/10 border border-[#00FFAA]/40 text-[#00FFAA] text-xs font-bold tracking-[0.2em] rounded-sm">
              {data.limited_drop_info_text || "DROP 001 ACTIVO"}
            </span>
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/20 text-white text-xs font-bold tracking-[0.2em] rounded-sm">
              AUTENTICIDAD VERIFICADA
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-sans font-black uppercase text-white tracking-tighter leading-none" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
              {data.hero_title_over_the_product || data.name}
            </h1>
            <p className="text-zinc-400 text-lg max-w-md font-light leading-relaxed">
              {data.hero_marketing_description || data.description}
            </p>
          </div>
          
          {/* Action Row */}
          <div className="w-full flex flex-col gap-6 items-start mt-2">
            <Countdown targetDate={data.countdown_target_date} />
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
              <button 
                onClick={handleAddToCart}
                className="px-8 py-5 bg-gradient-to-r from-[#BB00FF] to-[#8800FF] text-white font-black uppercase tracking-[0.2em] hover:from-[#d033ff] hover:to-[#a033ff] transition-all duration-300 active:scale-95 rounded-sm shadow-[0_0_30px_rgba(187,0,255,0.4)] w-full sm:w-auto text-center"
              >
                PRE-ORDENAR AHORA - ${parseFloat(data.price).toFixed(2)}
              </button>
              
              <button 
                onClick={() => navigate(`/product/${data.id}`)}
                className="text-zinc-400 hover:text-white uppercase tracking-widest text-xs font-bold underline transition-colors"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        {/* Right Parallax Image Wrapper */}
        <div className="relative flex justify-center items-center h-full min-h-[400px]">
           {/* Abstract aesthetic circle behind the main image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-[#181818] pointer-events-none" />
          
          <motion.div
            style={{ x, y, rotateX, rotateY, z: 100 }}
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.12}
            whileTap={{ cursor: "grabbing" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-grab w-full max-w-md z-10 p-8 flex items-center justify-center transition-all duration-300 ease-out"
          >
            <motion.img 
               src={data.image_url} 
               alt={data.name} 
               className="w-full h-auto object-contain filter drop-shadow-[0_0_60px_rgba(187,0,255,0.5)] transition-all duration-500"
               draggable="false"
               whileHover={{ scale: 1.05 }}
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
}

/* ========================================================
   Pure Countdown Sub-component
======================================================== */
function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 border border-[#00FFAA]/40 bg-[#00FFAA]/10 rounded-sm w-fit">
        <div className="w-2 h-2 rounded-full bg-[#00FFAA] animate-pulse" />
        <span className="text-[#00FFAA] font-sans tracking-[0.2em] font-bold text-sm uppercase" style={{ textShadow: '0 0 10px rgba(0,255,170,0.5)' }}>DROP ACTIVO</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 lg:gap-4 mb-2">
      <TimeUnit value={timeLeft.days} label="DÍAS" />
      <span className="text-zinc-600 font-light text-2xl self-start mt-2 hidden sm:block">:</span>
      <TimeUnit value={timeLeft.hours} label="HORAS" />
      <span className="text-zinc-600 font-light text-2xl self-start mt-2 hidden sm:block">:</span>
      <TimeUnit value={timeLeft.minutes} label="MINS" />
      <span className="text-zinc-600 font-light text-2xl self-start mt-2 hidden sm:block">:</span>
      <TimeUnit value={timeLeft.seconds} label="SEGS" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-16 h-16 lg:w-20 lg:h-20 border border-[#181818] bg-[#050505] rounded-sm shadow-inner relative">
      {/* Segment Line over middle */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/50 z-10" />
      <span className="text-2xl lg:text-3xl font-black text-[#00FFAA] font-sans relative z-0" style={{ textShadow: '0 0 12px rgba(0,255,170,0.35)' }}>{value.toString().padStart(2, '0')}</span>
      <span className="text-[9px] lg:text-[10px] text-white/70 tracking-widest uppercase mt-1 font-bold absolute bottom-1">{label}</span>
    </div>
  );
}

function calculateTimeLeft(target: string) {
  if (!target) return null;
  const difference = +new Date(target) - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  return null;
}
