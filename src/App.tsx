import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import Checkout from './pages/Checkout';
import type { Lang } from './types';
import './index.css';

type Page = 'home' | 'auth' | 'dashboard' | 'checkout';

const pageTransition = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1, transition: { duration: 0.3 } },
  exit:     { opacity: 0, transition: { duration: 0.2 } },
};

export default function App() {
  const [lang, setLang]   = useState<Lang>('es');
  const [page, setPage]   = useState<Page>('home');

  const handleToggleLang = () => setLang((prev) => (prev === 'es' ? 'en' : 'es'));

  return (
    <AnimatePresence mode="wait">
      {page === 'dashboard' ? (
        <motion.div key="dashboard" {...pageTransition} className="w-full">
          <UserDashboard 
            lang={lang} 
            onBack={() => setPage('home')} 
            onLogout={() => setPage('home')} 
          />
        </motion.div>
      ) : page === 'checkout' ? (
        <motion.div key="checkout" {...pageTransition} className="w-full">
          <Checkout 
            lang={lang} 
            onBack={() => setPage('home')} 
            onSuccess={() => setPage('dashboard')} 
          />
        </motion.div>
      ) : page === 'auth' ? (
        <motion.div key="auth" {...pageTransition}>
          <AuthPage lang={lang} onBack={() => setPage('home')} />
        </motion.div>
      ) : (
        <motion.div key="home" {...pageTransition}>
          <div className="min-h-screen bg-obsidian-black text-obsidian-text antialiased">
            {/* Subtle noise overlay */}
            <div className="noise-overlay" aria-hidden="true" />

            <Navbar
              lang={lang}
              onToggleLang={handleToggleLang}
              onOpenAuth={() => setPage('dashboard')} /* Simulated logic: goes straight to dashboard for demo */
            />

            <main>
              <Hero lang={lang} />
              <Features lang={lang} />
            </main>

            <Footer lang={lang} />

            {/* Cart Drawer — rendered at root so it overlays everything */}
            <CartDrawer 
              lang={lang} 
              onCheckout={() => setPage('checkout')} 
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
