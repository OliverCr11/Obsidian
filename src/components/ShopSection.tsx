import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { ShoppingBag } from 'lucide-react';
import type { Lang } from '../types';


interface ShopSectionProps {
  lang: Lang;
}

export default function ShopSection({ lang }: ShopSectionProps) {
  const { products, loading, error } = useProducts();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  return (
    <section id="shop" className="py-24 px-4 bg-obsidian-black relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
              {lang === 'es' ? 'Colección Exclusiva' : 'Exclusive Drop'}
            </h2>
            <p className="text-zinc-400">
              {lang === 'es' ? 'Piezas limitadas. No habrá restock.' : 'Limited pieces. No restocks.'}
            </p>
          </div>
        </div>

        {loading && (
          <div className="w-full flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-kevin-violet border-t-transparent animate-spin" />
          </div>
        )}

        {error && (
          <div className="w-full border border-red-500/30 bg-red-500/10 text-red-400 p-4 rounded-lg text-sm text-center">
            {lang === 'es' ? 'Error al cargar productos:' : 'Failed to load products:'} {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center text-zinc-500 py-20">
            {lang === 'es' ? 'No hay productos disponibles.' : 'No products available.'}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((glove) => (
            <div key={glove.id} className="group relative glass rounded-xl overflow-hidden hover:border-kevin-violet/50 transition-colors">
              
              {/* Image */}
              <div className="aspect-square bg-zinc-900/50 relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-kevin-violet/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={glove.image} 
                  alt={glove.name}
                  className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {glove.name}
                  </h3>
                  <span className="text-kevin-violet font-mono font-bold">
                    ${parseFloat(glove.price).toFixed(2)}
                  </span>
                </div>
                
                <p className="text-sm text-zinc-400 mb-6 line-clamp-2">
                  {glove.description || (lang === 'es' ? 'Sin descripción' : 'No description available')}
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
                      nameEs: glove.name, // Simplified for dynamic API data
                      price: parseFloat(glove.price),
                      image: glove.image,
                      size: glove.size,
                      variant: `Size ${glove.size}`,
                    });
                    openCart();
                  }}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-white text-black font-bold uppercase tracking-wider rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} />
                  {glove.stock > 0 
                    ? (lang === 'es' ? 'Agregar al Carrito' : 'Add to Cart') 
                    : (lang === 'es' ? 'Agotado' : 'Sold Out')}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
