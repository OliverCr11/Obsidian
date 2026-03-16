import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import type { Lang } from './types';
import './index.css';

export default function App() {
  const [lang, setLang] = useState<Lang>('es');

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-obsidian-black text-obsidian-text antialiased">
        {/* Subtle noise overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        <Navbar lang={lang} onToggleLang={handleToggleLang} />

        <main>
          <Hero lang={lang} />
          <Features lang={lang} />
        </main>

        <Footer lang={lang} />

        {/* Cart Drawer — rendered at root so it overlays everything */}
        <CartDrawer lang={lang} />
      </div>
    </CartProvider>
  );
}
