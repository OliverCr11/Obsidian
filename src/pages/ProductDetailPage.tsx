import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Ruler, ShieldCheck, Wind } from 'lucide-react';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCartStore } from '../store/useCartStore';
import type { Lang } from '../types';

export default function ProductDetailPage({ lang }: { lang: Lang }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProductDetail(slug);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // PART 1: ROBUST STATE LOGIC
  // Initialize as null safely before the product array arrives
  const [activeImage, setActiveImage] = useState<any>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Critical: Set Active Image once product safely evaluates inside Hook array
  useEffect(() => {
    if (product?.images?.length > 0) {
      const primary = product.images.find((img: any) => img.is_primary) || product.images[0];
      setActiveImage(primary);
    }
  }, [product]);

  // Handle loading firmly verifying safe boundaries preserving 404 pipelines
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

  // Check if product exists physically shielding undefined renders internally
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

  const getImageUrl = (path?: string) => {
    if (!path) return '/placeholder.jpg';
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
  };

  const handleAddToCart = () => {
    addItem({
      id: `db-pdp-${product.id}`,
      name: product.name,
      nameEs: product.name,
      price: parseFloat(product.price.toString()),
      image: activeImage ? getImageUrl(activeImage.image) : '/images/hero_glove.png',
      size: product.size || 'M',
      variant: `${product.category || 'Standard'} / Black`
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-obsidian-black text-white pt-24 pb-32 selection:bg-kevin-violet/30">
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
          
          {/* PART 2: THE COMPONENT STRUCTURE - MAIN GALLERY */}
          <div className="flex flex-col gap-4">
            
            {/* 1. Main Image Container */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#000000] border border-zinc-800"
            >
              <motion.img
                key={activeImage?.id || 'main-fallback'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                src={activeImage ? getImageUrl(activeImage.image) : '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 font-mono text-[10px] tracking-widest uppercase border border-zinc-800 text-zinc-400">
                // {product.category || 'CORE'}
              </div>
            </motion.div>

            {/* 2. Thumbnail List strictly isolated executing cleanly preventing crash cycles */}
            {product?.images && product.images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-2">
                {product.images.map((img: any) => {
                  const isActive = activeImage?.id === img.id;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#000000] border-2 transition-transform hover:scale-105 ${
                        isActive 
                          ? 'border-[#8A2BE2] opacity-100' 
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getImageUrl(img.image)}
                        alt={`Thumbnail ${img.id}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-8">
              {product.collection_type === 'DROP' && (
                <div className="inline-block px-3 py-1 bg-kevin-violet/10 border border-kevin-violet/30 text-kevin-glow text-xs font-mono mb-4 rounded uppercase tracking-widest">
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
                <ShieldCheck strokeWidth={1} className="text-kevin-violet" />
                <span className="text-xs uppercase tracking-widest font-bold">Premium Leather</span>
                <span className="text-xs text-zinc-500">Cabretta Grade-A</span>
              </div>
              <div className="flex flex-col gap-2">
                <Wind strokeWidth={1} className="text-kevin-violet" />
                <span className="text-xs uppercase tracking-widest font-bold">Climate Control</span>
                <span className="text-xs text-zinc-500">Micro-fiber lining</span>
              </div>
              <div className="flex flex-col gap-2">
                <Ruler strokeWidth={1} className="text-kevin-violet" />
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
