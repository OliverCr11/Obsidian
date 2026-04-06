import { ShieldCheck, Crosshair, Factory } from 'lucide-react';
import type { Lang } from '../types';

export default function BrandManifesto({ lang }: { lang: Lang }) {
  return (
    <section className="w-full bg-[#000000] py-24 sm:py-32 border-t border-[#181818] border-b relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-[#BB00FF]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-[#BB00FF] mb-4">
            {lang === 'es' ? 'Identidad de Marca' : 'Brand Identity'}
          </h2>
          <div className="w-px h-16 bg-gradient-to-b from-[#BB00FF]/50 to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          
          {/* Pillar 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 flex items-center justify-center rounded-sm bg-[#050505] border border-[#181818] group-hover:border-[#BB00FF]/50 transition-colors duration-500 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#BB00FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Crosshair size={32} className="text-[#A1A1AA] group-hover:text-white transition-colors duration-500" strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-4">
              {lang === 'es' ? 'Diseño Táctico' : 'Tactical Design'}
            </h3>
            <p className="text-[#A1A1AA] font-mono text-sm leading-relaxed max-w-xs">
              {lang === 'es' 
                ? 'Streetwear meets utility. Fabricado para soportar los entornos de más alto rendimiento preservando una silueta urbana impecable.' 
                : 'Streetwear meets utility. Engineered to withstand high-performance environments while maintaining a flawless urban silhouette.'}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 flex items-center justify-center rounded-sm bg-[#050505] border border-[#181818] group-hover:border-[#BB00FF]/50 transition-colors duration-500 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#BB00FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ShieldCheck size={32} className="text-[#A1A1AA] group-hover:text-white transition-colors duration-500" strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-4">
              {lang === 'es' ? 'Cuero Absoluto' : 'Absolute Leather'}
            </h3>
            <p className="text-[#A1A1AA] font-mono text-sm leading-relaxed max-w-xs">
              {lang === 'es'
                ? 'Componentes premium seleccionados a mano. Diseñado en su totalidad con materiales clase-A para una durabilidad sin concesiones.'
                : 'Hand-selected premium components. Fully engineered with Grade-A materials for uncompromising durability.'}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 flex items-center justify-center rounded-sm bg-[#050505] border border-[#181818] group-hover:border-[#BB00FF]/50 transition-colors duration-500 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#BB00FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Factory size={32} className="text-[#A1A1AA] group-hover:text-white transition-colors duration-500" strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-white mb-4">
              {lang === 'es' ? 'Lotes Limitados' : 'Limited Batches'}
            </h3>
            <p className="text-[#A1A1AA] font-mono text-sm leading-relaxed max-w-xs">
              {lang === 'es'
                ? 'Tiradas de producción exclusivas. Una vez que un Drop se agota, los patrones se destruyen y nunca vuelven a ser producidos.'
                : 'Exclusive production runs. Once a Drop sells out, the patterns are destroyed and never produced again.'}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
