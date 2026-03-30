import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { ShoppingBag } from 'lucide-react';
import type { Lang, Glove } from '../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface CatalogPageProps {
  lang: Lang;
  type: 'DROP' | 'CORE';
}

export default function CatalogPage({ type }: CatalogPageProps) {
  const { products, loading, error } = useProducts(type);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Filtering is now securely handled by the Django backend natively!
  const filteredProducts = products;

  const getDisplayImage = (glove: Glove) => {
    const path = glove.images?.find((img) => img.is_primary)?.image || glove.images?.[0]?.image;
    if (!path) return '/images/hero_glove.png';
    return path.startsWith('http') ? path : `${baseURL}${path}`;
  };

  const title = type === 'DROP' ? 'DROPS' : 'CORE COLLECTION';
  const desc = type === 'DROP' 
    ? 'Exclusive tactical gear. Once sold out, never reproduced.' 
    : 'Permanent tactical equipment. Built for the daily grind.';

  // Scroll to top automatically
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <section className="py-24 px-4 bg-obsidian-black relative min-h-screen">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase">
              {title}
            </h2>
            <p className="text-zinc-400">
              {desc}
            </p>
          </div>
        </div>

        {loading && (
          <div className="w-full flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#8A2BE2] border-t-transparent animate-spin" />
          </div>
        )}

        {error && (
          <div className="w-full border border-red-500/30 bg-red-500/10 text-red-400 p-4 rounded-lg text-sm text-center">
            Failed to load registry: {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center justify-center items-center flex flex-col py-24 glass rounded-xl border border-zinc-900 border-dashed">
            <span className="text-[#8A2BE2] text-4xl mb-4 font-mono">_</span>
            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase mb-2">
              Signal Lost
            </p>
            <p className="text-zinc-600 font-bold tracking-widest uppercase">
              No items found in this sector.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((glove: Glove) => (
            <div key={glove.id} className="group relative glass rounded-xl overflow-hidden hover:border-[#8A2BE2]/50 transition-colors">
              
              <Link to={`/product/${glove.slug}`} className="block aspect-square bg-zinc-900/50 relative overflow-hidden flex items-center justify-center p-8 group-hover:bg-zinc-900/80 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8A2BE2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={getDisplayImage(glove)} 
                  alt={glove.name}
                  className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    <Link to={`/product/${glove.slug}`} className="hover:text-[#8A2BE2] transition-colors">
                      {glove.name}
                    </Link>
                  </h3>
                  <span className="text-[#8A2BE2] font-mono font-bold">
                    ${parseFloat(glove.price).toFixed(2)}
                  </span>
                </div>
                
                <p className="text-sm text-zinc-400 mb-6 line-clamp-2">
                  {glove.description || 'No description available'}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-xs font-mono text-zinc-500">
                    SIZE: <span className="text-white">{glove.size}</span>
                  </div>
                  <div className="text-xs font-mono text-zinc-500">
                    STOCK: <span className={glove.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {glove.stock > 0 ? glove.stock : 'SOLD OUT'}
                    </span>
                  </div>
                </div>

                <button 
                  disabled={glove.stock <= 0}
                  onClick={() => {
                    addItem({
                      id: `db-glove-${glove.id}`,
                      name: glove.name,
                      nameEs: glove.name,
                      price: parseFloat(glove.price),
                      image: getDisplayImage(glove),
                      size: glove.size,
                      variant: `Size ${glove.size}`,
                    });
                    openCart();
                  }}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} />
                  {glove.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
