import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Ruler, ShieldCheck, Wind, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCartStore } from '../store/useCartStore';
import type { Lang } from '../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// SLIDER ANIMATION VARIANTS
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};



export default function ProductDetailPage({ lang }: { lang: Lang }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetail(id);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // PART 1: ROBUST STATE LOGIC FOR SLIDER
  const [currentIndex, setCurrentIndex] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Reset index when product mounts safely capturing the Array limits
  useEffect(() => {
    if (product?.images?.length) {
      // Safely default to the explicit primary configuration index or origin 0
      const primaryIdx = product.images.findIndex((img: any) => img.is_primary);
      setCurrentIndex(primaryIdx >= 0 ? primaryIdx : 0);
    } else {
      setCurrentIndex(0);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#8A2BE2] border-t-transparent animate-spin" />
        <div className="ml-4 text-kevin-violet animate-pulse font-mono tracking-widest uppercase text-sm">
          Decrypting Data...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-obsidian-black flex flex-col items-center justify-center p-4">
        <div className="glass p-12 rounded-2xl border border-red-500/20 text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 noise-overlay" />
          <span className="text-6xl font-mono text-kevin-violet/50 mb-6 block">404</span>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-4">
            {lang === 'es' ? 'Archivo No Encontrado' : 'Archive Not Found'}
          </h1>
          <p className="text-zinc-400 font-mono text-sm mb-8">
            {lang === 'es' ? 'El sector solicitado no existe.' : 'The requested sector does not exist.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 justify-center w-full py-4 rounded bg-zinc-900 border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={16} />
            {lang === 'es' ? 'VOLVER A BASE' : 'RETURN TO BASE'}
          </button>
        </div>
      </div>
    );
  }

  // Pre-calculate array boundaries cleanly
  const images = product.images || [];

  const getImageUrl = (path?: string) => {
    if (!path) return '/placeholder.jpg';
    return path.startsWith('http') ? path : `${baseURL}${path}`;
  };

  const paginate = (newDirection: number) => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      // Infinite Pagination Loop Handlers
      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;
      return next;
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: `db-pdp-${product.id}`,
      name: product.name,
      nameEs: product.name,
      price: parseFloat(product.price.toString()),
      image: images.length > 0 ? getImageUrl(images[currentIndex].image) : '/images/hero_glove.png',
      size: product.size || 'M',
      variant: `${product.category || 'Standard'} / Black`
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-obsidian-black text-white pt-24 pb-32 selection:bg-kevin-violet/30 overflow-x-hidden">
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-mono tracking-widest text-xs mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {lang === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10 w-full">

          {/* PART 2: THE COMPONENT STRUCTURE - LUXURY SLIDER */}
          <div className="flex flex-col gap-4">

            {/* Main Interactive Slide Container - CSS HARDWARE ACCELERATED */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#000000] border border-zinc-800 group/slider">

              {/* Force mapping bounds dynamically securely wrapping flex tracks */}
              {images.length > 0 ? (
                <motion.div
                  className="flex w-full h-full"
                  animate={{ x: `-${currentIndex * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag={images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                >
                  {images.map((img: any) => (
                    <div key={img.id} className="min-w-full h-full flex-shrink-0 relative">
                      <img
                        src={getImageUrl(img.image)}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <img
                  src="/placeholder.jpg"
                  alt="Fallback"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )}

              {/* ARROWS: Desktop hover overlays conditionally hidden natively on Mobile interfaces using Tailwind bounds */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-black hover:border-[#8A2BE2] z-10 hidden sm:flex"
                    onClick={() => paginate(-1)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-black hover:border-[#8A2BE2] z-10 hidden sm:flex"
                    onClick={() => paginate(1)}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* PAGINATION DOTS */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
                  {images.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#8A2BE2] w-8' : 'bg-white/30 w-2 hover:bg-white/60'
                        }`}
                    />
                  ))}
                </div>
              )}

              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 font-mono text-[10px] tracking-widest uppercase border border-zinc-800 text-zinc-400 z-10">
                // {product.category || 'CORE'}
              </div>

            </div>
          </div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-8">
              {product.collection_type === 'DROP' && (
                <div className="inline-block px-3 py-1 bg-kevin-violet/10 border border-[#8A2BE2]/30 text-kevin-glow text-xs font-mono mb-4 rounded uppercase tracking-widest">
                  {lang === 'es' ? 'Edición Limitada' : 'Limited Edition'}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
                {product.name}
              </h1>
              <div className="text-2xl font-mono text-zinc-300">
                ${product.price}
              </div>
            </div>

            <div className="prose prose-invert prose-p:text-zinc-400 prose-p:leading-relaxed mb-10">
              <p>{product.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 border-y border-zinc-800/60 py-8">
              <div className="flex flex-col gap-2">
                <ShieldCheck strokeWidth={1} className="text-[#8A2BE2]" />
                <span className="text-xs uppercase tracking-widest font-bold">Premium Leather</span>
                <span className="text-xs text-zinc-500">Cabretta Grade-A</span>
              </div>
              <div className="flex flex-col gap-2">
                <Wind strokeWidth={1} className="text-[#8A2BE2]" />
                <span className="text-xs uppercase tracking-widest font-bold">Climate Control</span>
                <span className="text-xs text-zinc-500">Micro-fiber lining</span>
              </div>
              <div className="flex flex-col gap-2">
                <Ruler strokeWidth={1} className="text-[#8A2BE2]" />
                <span className="text-xs uppercase tracking-widest font-bold">True Fit</span>
                <span className="text-xs text-zinc-500">Ergonomic cut</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded bg-white px-8 py-5 font-black text-black transition-transform hover:scale-[1.02] active:scale-[0.98] z-10"
            >
              <div className="absolute inset-0 translate-y-[100%] bg-zinc-200 transition-transform duration-300 group-hover:translate-y-0" />
              <ShoppingBag size={20} className="relative z-10" />
              <span className="relative z-10 uppercase tracking-[0.2em] text-sm">
                {lang === 'es' ? 'Añadir al Carrito' : 'Add to Cart'}
              </span>
            </button>

            <p className="text-center mt-6 text-xs text-zinc-600 font-mono">
              {lang === 'es' ? 'Envío seguro a nivel mundial.' : 'Secure global shipping.'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
