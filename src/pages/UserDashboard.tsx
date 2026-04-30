import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Settings, LogOut, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import type { Lang } from '../types';

interface UserDashboardProps {
  lang: Lang;
  onBack: () => void;
  onLogout?: () => void;
}

type Tab = 'profile' | 'orders' | 'settings';

export default function UserDashboard({ lang, onBack }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const { logout } = useAuth();
  const { orders, loading, error } = useOrders();

  const toggleOrder = (id: string) => {
    setExpandedOrders(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
  };

  // ─── BILINGUAL DICTIONARY ───
  const dict = {
    en: {
      title: 'THE VAULT',
      subtitle: 'TRANSMISSION HISTORY',
      date: 'DATE',
      status: 'STATUS',
      total: 'TOTAL',
      processing: 'PROCESSING',
      shipped: 'SHIPPED',
      delivered: 'DELIVERED',
      empty: 'NO TRANSMISSIONS FOUND. THE VAULT IS EMPTY.',
      decrypting: 'DECRYPTING RECORDS...',
      back: 'Back to Store',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Log out',
      account: 'Account'
    },
    es: {
      title: 'LA BÓVEDA',
      subtitle: 'HISTORIAL DE TRANSMISIONES',
      date: 'FECHA',
      status: 'ESTADO',
      total: 'TOTAL PAGADO',
      processing: 'PROCESANDO',
      shipped: 'ENVIADO',
      delivered: 'ENTREGADO',
      empty: 'NO SE ENCONTRARON TRANSMISIONES. LA BÓVEDA ESTÁ VACÍA.',
      decrypting: 'DESCIFRANDO REGISTROS...',
      back: 'Volver',
      profile: 'Perfil',
      settings: 'Ajustes',
      logout: 'Cerrar sesión',
      account: 'Cuenta'
    }
  };
  const t = dict[lang];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Delivered': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const translateStatus = (status: string) => {
    if (status === 'Processing') return t.processing;
    if (status === 'Shipped') return t.shipped;
    if (status === 'Delivered') return t.delivered;
    return status.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col md:flex-row selection:bg-[#8A2BE2]/30">
      
      {/* ─── Mobile Header ─── */}
      <div className="md:hidden flex items-center justify-between p-4 glass border-b border-zinc-800/50 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-white font-black tracking-[0.2em] text-sm">OBSIDIAN</div>
        <div className="w-8" />
      </div>

      {/* ─── Sidebar ─── */}
      <aside className="
        fixed bottom-0 left-0 right-0 z-30 md:static md:w-64 md:shrink-0
        glass border-t md:border-t-0 md:border-r border-zinc-800/50
        flex md:flex-col justify-around md:justify-start
        p-2 md:p-6 gap-2 md:gap-4 bg-[#000000]/80 backdrop-blur-xl
      ">
        <div className="hidden md:block mb-8">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-400 hover:text-[#8A2BE2] transition-colors text-sm font-medium mb-6 uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t.back}
          </button>
          <h2 className="text-2xl font-black text-white tracking-widest">{t.account}</h2>
        </div>

        <nav className="flex md:flex-col w-full gap-1 md:gap-2 justify-around md:justify-start">
          {[
            { id: 'orders', icon: Package, label: t.subtitle },
            { id: 'profile', icon: User, label: t.profile },
            { id: 'settings', icon: Settings, label: t.settings },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`
                  relative flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 
                  p-3 md:p-3 rounded-xl transition-all duration-300 w-full uppercase tracking-wider
                  ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabDashboard"
                    className="absolute inset-0 bg-[#8A2BE2]/10 border border-[#8A2BE2]/20 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} className="relative z-10 shrink-0" />
                <span className="relative z-10 text-[10px] md:text-xs font-bold">
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="hidden md:block flex-grow" />
          
          <button
            onClick={logout}
            className="hidden md:flex items-center gap-3 p-3 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-900/10 transition-colors mt-auto w-full border border-transparent hover:border-red-900/30 uppercase tracking-wider"
          >
            <LogOut size={20} />
            <span className="text-xs font-bold">{t.logout}</span>
          </button>
        </nav>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 pb-24 md:pb-12 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-black text-white tracking-[0.1em] uppercase mb-2">
                    {t.title}
                  </h1>
                  <p className="text-[#8A2BE2] font-mono text-xs tracking-widest uppercase">
                    // {t.subtitle}
                  </p>
                </div>

                <div className="glass bg-[#000000]/60 rounded-2xl border border-zinc-900 overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-zinc-900 text-[10px] font-mono font-bold text-zinc-500 tracking-[0.2em] uppercase">
                    <div className="col-span-3">ORDER ID</div>
                    <div className="col-span-3">{t.date}</div>
                    <div className="col-span-3">{t.status}</div>
                    <div className="col-span-2 text-right">{t.total}</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="divide-y divide-zinc-900 min-h-[300px] relative">
                    
                    {loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <Loader2 className="animate-spin mb-4 text-[#8A2BE2]" size={32} />
                        <span className="text-[#8A2BE2] font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
                          {t.decrypting}
                        </span>
                      </div>
                    )}

                    {!loading && error && (
                      <div className="flex flex-col items-center justify-center p-12 text-center text-red-500">
                        <span className="text-sm font-mono tracking-widest uppercase">{error}</span>
                      </div>
                    )}

                    {!loading && !error && orders.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500">
                        <Package size={32} className="mb-4 text-zinc-700" />
                        <span className="text-sm font-mono uppercase tracking-[0.2em]">{t.empty}</span>
                      </div>
                    )}

                    {!loading && !error && orders.map((order) => {
                      const isExpanded = expandedOrders.includes(order.order_id);
                      return (
                        <div
                          key={order.id || order.order_id}
                          className="group flex flex-col hover:bg-zinc-900/30 transition-colors"
                        >
                          {/* Main Clickable Row */}
                          <button 
                            onClick={() => toggleOrder(order.order_id)}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:items-center w-full text-left"
                          >
                            {/* Mobile Header */}
                            <div className="flex justify-between items-center md:hidden mb-2">
                              <span className="text-white font-mono text-sm font-bold">{order.order_id.split('-')[0]}...</span>
                              <span className={`px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase border ${getStatusColor(order.status)}`}>
                                {translateStatus(order.status)}
                              </span>
                            </div>

                            <div className="hidden md:block col-span-3 text-white font-mono text-xs tracking-wider opacity-80 truncate pr-4">
                              {order.order_id}
                            </div>
                            <div className="col-span-3 text-zinc-400 font-mono text-xs tracking-wider">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                            <div className="hidden md:block col-span-3">
                              <span className={`px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold uppercase border ${getStatusColor(order.status)}`}>
                                {translateStatus(order.status)}
                              </span>
                            </div>
                            <div className="col-span-2 text-left md:text-right font-mono text-white text-sm">
                              ${Number(order.total_paid).toFixed(2)}
                              <span className="text-[#8A2BE2] ml-1">USD</span>
                            </div>
                            <div className="hidden md:flex col-span-1 justify-end">
                              <div className={`h-8 w-8 rounded flex items-center justify-center text-zinc-600 group-hover:bg-[#8A2BE2]/10 transition-all border border-transparent group-hover:border-[#8A2BE2]/30 ${isExpanded ? 'rotate-90 text-[#8A2BE2] border-[#8A2BE2]/50 bg-[#8A2BE2]/20' : 'group-hover:text-[#8A2BE2]'}`}>
                                <ChevronRight size={18} />
                              </div>
                            </div>
                          </button>

                          {/* ─── NESTED ITEM THUMBNAILS (ACCORDION) ─── */}
                          <AnimatePresence>
                            {isExpanded && order.items && order.items.length > 0 && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-1 border-t border-zinc-900/50 flex gap-3 overflow-x-auto pb-4 custom-scrollbar bg-black/40">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 p-2 rounded shrink-0 min-w-[200px] hover:border-[#8A2BE2]/40 transition-colors">
                                      <div className="w-12 h-12 rounded bg-black overflow-hidden shrink-0 border border-zinc-800 flex items-center justify-center relative">
                                        <img 
                                          src={item.glove_image || '/placeholder.jpg'} 
                                          className="absolute inset-0 w-full h-full object-cover object-center" 
                                          alt="Product Thumbnail" 
                                        />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-white font-bold tracking-wider text-[10px] uppercase line-clamp-1">
                                          {lang === 'es' ? (item.glove_name_es || item.glove_name) : item.glove_name}
                                        </span>
                                        <span className="text-zinc-500 font-mono text-[10px] tracking-widest mt-0.5">
                                          QTY: {item.quantity}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Ignored Profile / Settings for MVP Scope */}
            {activeTab === 'profile' && (
              <div className="glass p-8 rounded-2xl border border-zinc-900 bg-[#000000]/60 flex flex-col items-center justify-center min-h-[400px] text-center">
                <User size={48} className="text-[#8A2BE2] mb-4 opacity-50" />
                <h3 className="text-xl font-bold tracking-widest uppercase text-white mb-2">{t.profile}</h3>
                <p className="text-zinc-500 font-mono text-xs max-w-md">// SECTION UNDER ENCRYPTION</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass p-8 rounded-2xl border border-zinc-900 bg-[#000000]/60 flex flex-col items-center justify-center min-h-[400px] text-center">
                <Settings size={48} className="text-[#8A2BE2] mb-4 opacity-50" />
                <h3 className="text-xl font-bold tracking-widest uppercase text-white mb-2">{t.settings}</h3>
                <p className="text-zinc-500 font-mono text-xs max-w-md">// VAULT CONFIGURATIONS LOCKED</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
