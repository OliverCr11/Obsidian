import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Settings, LogOut, ChevronRight, ArrowLeft } from 'lucide-react';
import type { Lang } from '../types';

interface UserDashboardProps {
  lang: Lang;
  onBack: () => void;
  onLogout?: () => void;
}

// Dummy Order Data
const MOCK_ORDERS = [
  {
    id: 'ORD-001X-A9F',
    date: 'Mar 15, 2026',
    status: 'Processing',
    total: 120.00,
    items: 1,
  },
  {
    id: 'ORD-092Y-B2C',
    date: 'Feb 10, 2026',
    status: 'Shipped',
    total: 240.00,
    items: 2,
  },
  {
    id: 'ORD-044Z-F1X',
    date: 'Jan 05, 2026',
    status: 'Delivered',
    total: 120.00,
    items: 1,
  },
];

type Tab = 'profile' | 'orders' | 'settings';

export default function UserDashboard({ lang, onBack, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Delivered': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-black text-obsidian-text flex flex-col md:flex-row">
      
      {/* ─── Mobile Header (Visible only on mobile) ─── */}
      <div className="md:hidden flex items-center justify-between p-4 glass border-b border-zinc-800/50 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-white font-black tracking-widest text-sm">OBSIDIAN</div>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* ─── Sidebar (Left on Desktop, Bottom on Mobile) ─── */}
      <aside className="
        fixed bottom-0 left-0 right-0 z-30 md:static md:w-64 md:shrink-0
        glass border-t md:border-t-0 md:border-r border-zinc-800/50
        flex md:flex-col justify-around md:justify-start
        p-2 md:p-6 gap-2 md:gap-4
      ">
        <div className="hidden md:block mb-8">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium mb-6"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {lang === 'es' ? 'Volver' : 'Back to Store'}
          </button>
          <h2 className="text-2xl font-black text-white tracking-tight">Account</h2>
          <p className="text-zinc-500 text-sm mt-1">test@obsidian.ec</p>
        </div>

        <nav className="flex md:flex-col w-full gap-1 md:gap-2 justify-around md:justify-start">
          {[
            { id: 'orders', icon: Package, label: 'Order History' },
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`
                  relative flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 
                  p-3 md:p-3 rounded-xl transition-all duration-300 w-full
                  ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabDashboard"
                    className="absolute inset-0 bg-kevin-violet/10 border border-kevin-violet/20 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={20} className="relative z-10 shrink-0" />
                <span className="relative z-10 text-[10px] md:text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="hidden md:block flex-grow" />
          
          <button
            onClick={onLogout}
            className="hidden md:flex items-center gap-3 p-3 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-colors mt-auto w-full"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Log out</span>
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
                  <h1 className="text-3xl font-black text-white tracking-tight mb-2">Order History</h1>
                  <p className="text-zinc-400 text-sm">View and track your previous Obsidian drops.</p>
                </div>

                <div className="glass rounded-2xl border border-zinc-800/50 overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-zinc-800/50 text-xs font-mono font-bold text-zinc-500 tracking-wider">
                    <div className="col-span-3">ORDER ID</div>
                    <div className="col-span-3">DATE</div>
                    <div className="col-span-3">STATUS</div>
                    <div className="col-span-2 text-right">TOTAL</div>
                    <div className="col-span-1"></div>
                  </div>

                  <div className="divide-y divide-zinc-800/50">
                    {MOCK_ORDERS.map((order) => (
                      <div
                        key={order.id}
                        className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 md:items-center hover:bg-zinc-800/30 transition-colors"
                      >
                        {/* Mobile Header per row */}
                        <div className="flex justify-between items-center md:hidden mb-2">
                          <span className="text-white font-mono text-sm font-bold">{order.id}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="hidden md:block col-span-3 text-white font-mono text-sm font-bold">
                          {order.id}
                        </div>
                        <div className="col-span-3 text-zinc-400 text-sm">
                          {order.date}
                          <div className="text-xs mt-0.5 text-zinc-600 md:hidden">{order.items} item(s)</div>
                        </div>
                        <div className="hidden md:block col-span-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="col-span-2 text-left md:text-right font-mono text-white text-sm">
                          ${order.total.toFixed(2)}
                          <span className="text-zinc-600 ml-1">USD</span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 group-hover:bg-kevin-violet/10 group-hover:text-kevin-violet transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="glass p-8 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center min-h-[400px] text-center">
                <User size={48} className="text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Profile Settings</h3>
                <p className="text-zinc-400 max-w-md">Manage your shipping addresses and personal information here for faster checkouts on the next drop.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="glass p-8 rounded-2xl border border-zinc-800/50 flex flex-col items-center justify-center min-h-[400px] text-center">
                <Settings size={48} className="text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Account Preferences</h3>
                <p className="text-zinc-400 max-w-md">Update your email, password, and communication preferences.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
