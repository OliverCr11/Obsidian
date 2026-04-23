import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MainDropHero from './components/MainDropHero';
import BrandManifesto from './components/BrandManifesto';

import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import Checkout from './pages/Checkout';
import ProductDetailPage from './pages/ProductDetailPage';
import CatalogPage from './pages/CatalogPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import type { Lang } from './types';
import './index.css';

const pageTransition = {
  initial:  { opacity: 0 },
  animate:  { opacity: 1, transition: { duration: 0.3 } },
  exit:     { opacity: 0, transition: { duration: 0.2 } },
};

function RouterApp() {
  const [lang, setLang] = useState<Lang>('es');
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/dashboard" element={
            <motion.div {...pageTransition} className="w-full">
              <UserDashboard 
                lang={lang} 
                onBack={() => navigate('/')} 
                onLogout={() => navigate('/')} 
              />
            </motion.div>
          } />
          
          <Route path="/checkout" element={
            <motion.div {...pageTransition} className="w-full">
              <Checkout 
                lang={lang} 
                onBack={() => navigate('/')} 
                onSuccess={() => navigate('/dashboard')} 
              />
            </motion.div>
          } />
          
          <Route path="/auth" element={
            <motion.div {...pageTransition}>
              <AuthPage lang={lang} onBack={() => navigate('/')} />
            </motion.div>
          } />
          
          <Route path="/product/:id" element={
            <motion.div {...pageTransition} className="w-full">
              <ProductDetailPage lang={lang} />
            </motion.div>
          } />

          <Route path="/verify-email/:token" element={
            <motion.div {...pageTransition} className="w-full">
              <VerifyEmailPage lang={lang} />
            </motion.div>
          } />

          {/* Catch-all Homepage Route - Only shows Hero now */}
          <Route path="/" element={
            <motion.div {...pageTransition}>
              <div className="min-h-screen bg-obsidian-black text-obsidian-text antialiased">
                <div className="noise-overlay" aria-hidden="true" />
                <Navbar
                  lang={lang}
                  onToggleLang={() => setLang((prev) => (prev === 'es' ? 'en' : 'es'))}
                  onOpenAuth={() => navigate('/dashboard')} 
                />
                <main>
                  <MainDropHero lang={lang} />
                  <BrandManifesto lang={lang} />
                </main>
                <Footer lang={lang} />
              </div>
            </motion.div>
          } />

          {/* Drops Page Map */}
          <Route path="/drops" element={
            <motion.div {...pageTransition}>
              <div className="min-h-screen bg-obsidian-black text-obsidian-text antialiased">
                <div className="noise-overlay" aria-hidden="true" />
                <Navbar
                  lang={lang}
                  onToggleLang={() => setLang((prev) => (prev === 'es' ? 'en' : 'es'))}
                  onOpenAuth={() => navigate('/dashboard')} 
                />
                <main>
                  <CatalogPage lang={lang} type="DROP" />
                </main>
                <Footer lang={lang} />
              </div>
            </motion.div>
          } />

          {/* Core Collection Map */}
          <Route path="/core" element={
            <motion.div {...pageTransition}>
              <div className="min-h-screen bg-obsidian-black text-obsidian-text antialiased">
                <div className="noise-overlay" aria-hidden="true" />
                <Navbar
                  lang={lang}
                  onToggleLang={() => setLang((prev) => (prev === 'es' ? 'en' : 'es'))}
                  onOpenAuth={() => navigate('/dashboard')} 
                />
                <main>
                  <CatalogPage lang={lang} type="CORE" />
                </main>
                <Footer lang={lang} />
              </div>
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>

      {/* Cart Drawer lives safely outside the route tree context so it floats globally! */}
      <CartDrawer 
        lang={lang} 
        onCheckout={() => navigate('/checkout')} 
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouterApp />
    </BrowserRouter>
  );
}
