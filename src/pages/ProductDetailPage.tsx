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

  // PART 1: ROBUST STATE LOGIC FOR SLIDER & SELECTORS
  const [currentIndex, setCurrentIndex] = useState(0);
  const sizes = ['S', 'M', 'L', 'XL'] as const;
  const [selectedSize, setSelectedSize] = useState<typeof sizes[number]>('M');

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
      <div className="min-h-screen bg-[#000000] px-4 pt-32 pb-32 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 w-full">
        <div className="w-full lg:w-1/2 aspect-square bg-[#181818] animate-pulse rounded-sm border border-zinc-900" />
        <div className="w-full lg:w-1/2 flex flex-col gap-6 justify-center">
          <div className="w-3/4 h-16 bg-[#181818] animate-pulse rounded-sm" />
          <div className="w-1/4 h-10 bg-[#181818] animate-pulse rounded-sm" />
          <div className="w-full h-32 bg-[#181818] animate-pulse rounded-sm mt-8 border border-zinc-900" />
          <div className="w-full h-16 bg-[#181818] animate-pulse rounded-sm mt-8" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-obsidian-black flex flex-col items-center justify-center p-4">
        <div className="glass p-12 rounded-2xl border border-red-500/20 text-center max-w-md w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 noise-overlay" />
          <span className="text-6xl font-mono text-[#BB00FF]/50 mb-6 block drop-shadow-[0_0_15px_rgba(187,0,255,0.4)]">SIGNAL LOST</span>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-4">
            {lang === 'es' ? 'PRODUCTO NO ENCONTRADO' : 'PRODUCT NOT FOUND'}
          </h1>
          <p className="text-zinc-400 font-mono text-sm mb-8">
            {lang === 'es' ? 'Registro borrado o enlace inactivo.' : 'Registry purged or link inactive.'}
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="flex items-center gap-2 justify-center w-full py-4 rounded-sm bg-zinc-900 border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={16} />
            {lang === 'es' ? 'VOLVER AL CATÁLOGO' : 'BACK TO CATALOG'}
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
      id: `db-pdp-${product.id}-${selectedSize}`,
      name: product.name,
      nameEs: product.name,
      price: parseFloat(product.price.toString()),
      image: images.length > 0 ? getImageUrl(images[currentIndex].image) : '/images/hero_glove.png',
      size: selectedSize,
      variant: `${product.category || 'Standard'} / ${selectedSize}`
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 pb-32 selection:bg-[#BB00FF]/30 overflow-x-hidden">
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase font-mono tracking-widest text-xs mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {lang === 'es' ? 'VOLVER AL CATÁLOGO' : 'BACK TO CATALOG'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10 w-full">

          {/* PART 2: THE COMPONENT STRUCTURE - LUXURY SLIDER */}
          <div className="flex flex-col gap-4">

            {/* Main Interactive Slide Container - CSS HARDWARE ACCELERATED */}
            <div className="relative aspect-square w-full rounded-sm overflow-hidden bg-[#0a0a0a] border border-[#181818] group/slider">

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
                    <div key={img.id} className="min-w-full h-full flex-shrink-0 relative flex items-center justify-center p-8 overflow-hidden">
                      <motion.img
                        src={getImageUrl(img.image)}
                        alt={product.name}
                        className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_15px_rgba(187,0,255,0.2)]"
                        initial={{ y: 10 }}
                        animate={{ y: [10, -10, 10] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        whileHover={{ scale: 1.15 }}
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded bg-black/50 backdrop-blur-md border border-white/10 text-white items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#181818] hover:border-[#BB00FF] hover:text-[#BB00FF] hover:shadow-[0_0_15px_rgba(187,0,255,0.5)] z-10 hidden sm:flex"
                    onClick={() => paginate(-1)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded bg-black/50 backdrop-blur-md border border-white/10 text-white items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#181818] hover:border-[#BB00FF] hover:text-[#BB00FF] hover:shadow-[0_0_15px_rgba(187,0,255,0.5)] z-10 hidden sm:flex"
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
                      className={`h-1.5 rounded-none transition-all duration-300 ${idx === currentIndex ? 'bg-[#BB00FF] w-12 shadow-[0_0_8px_rgba(187,0,255,0.8)]' : 'bg-white/20 w-4 hover:bg-white/50'
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
            <div className="mb-6">
              {product.collection_type === 'DROP' && (
                <div className="inline-block px-3 py-1 bg-[#BB00FF]/10 text-[#BB00FF] border border-[#BB00FF]/50 text-xs font-mono mb-4 rounded-sm uppercase tracking-widest drop-shadow-[0_0_8px_rgba(187,0,255,0.3)]">
                  {lang === 'es' ? 'Edición Especial' : 'Special Drop'}
                </div>
              )}
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-4 leading-[0.9] text-white">
                {product.name}
              </h1>
              <div className="text-3xl font-mono font-bold text-white tracking-wider">
                ${parseFloat(product.price.toString()).toFixed(2)}
              </div>
            </div>

            <div className="prose prose-invert prose-p:text-[#A1A1AA] prose-p:leading-relaxed mb-8 text-base sm:text-lg">
              <p>{product.description}</p>
            </div>

            {/* Interactive Size Selector */}
            <div className="mb-10">
              <div className="text-xs text-[#A1A1AA] font-mono tracking-widest uppercase mb-3 drop-shadow-sm">
                {lang === 'es' ? 'Seleccionar Talla' : 'Select Size'}
              </div>
              <div className="flex gap-4">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-14 h-14 border flex items-center justify-center font-mono text-lg font-bold transition-all duration-300 rounded-sm
                      ${selectedSize === s 
                        ? 'border-[#BB00FF] text-[#BB00FF] bg-[#BB00FF]/5 shadow-[0_0_15px_rgba(187,0,255,0.4)]' 
                        : 'border-[#181818] text-zinc-500 hover:text-white hover:border-zinc-700 bg-[#050505]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* High-End Purple Gradient Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-8 py-5 mt-2 bg-gradient-to-r from-[#BB00FF] to-[#8800FF] text-white font-black uppercase tracking-[0.2em] hover:from-[#d033ff] hover:to-[#a033ff] transition-all duration-300 active:scale-95 rounded-sm shadow-[0_0_30px_rgba(187,0,255,0.3)] hover:shadow-[0_0_40px_rgba(187,0,255,0.5)] flex items-center justify-center gap-3"
            >
              <ShoppingBag size={20} />
              {lang === 'es' ? 'Añadir al Carrito' : 'Add to Cart'}
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
