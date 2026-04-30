import { useState } from 'react';
import { Loader2, Tag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import api from '../api/axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function CouponInput({ lang }: { lang?: string }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const applyDiscount = useCartStore((s) => s.applyDiscount);
  const discount = useCartStore((s) => s.discount);
  const removeDiscount = useCartStore((s) => s.removeDiscount);
  const totalItems = useCartStore((s) => s.totalItems());

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post('/orders/apply-coupon/', { code: code.trim().toUpperCase() });
      const data = res.data;
      
      applyDiscount({
        code: data.code,
        type: data.discount_type,
        value: parseFloat(data.value)
      });
      setMessage({ 
        text: lang === 'es' 
          ? `¡Descuento de ${data.discount_type === 'PERCENTAGE' ? data.value + '%' : '$' + data.value} Aplicado!` 
          : `${data.discount_type === 'PERCENTAGE' ? data.value + '%' : '$' + data.value} Discount Applied!`, 
        type: 'success' 
      });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message;
      setMessage({ 
        text: lang === 'es' ? (errorMsg === 'Invalid or expired coupon' ? 'Cupón inválido o expirado' : errorMsg) : errorMsg, 
        type: 'error' 
      });
      removeDiscount();
    } finally {
      setLoading(false);
    }
  };

  if (totalItems === 0) return null;

  if (discount) {
    return (
      <div className="flex items-center justify-between p-3 bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg">
        <div className="flex items-center gap-2 text-[#39FF14]">
          <Tag size={16} />
          <span className="font-mono text-sm font-bold tracking-wider">{discount.code}</span>
        </div>
        <button onClick={() => { removeDiscount(); setCode(''); setMessage(null); }} className="text-xs text-[#39FF14]/70 hover:text-[#39FF14] transition-colors uppercase font-bold tracking-wider">
          {lang === 'es' ? 'Eliminar' : 'Remove'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={lang === 'es' ? "CÓDIGO PROMO" : "PROMO CODE"}
          className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 outline-none rounded-lg px-3 text-white font-mono text-sm uppercase placeholder:text-zinc-600 transition-all"
          disabled={loading}
        />
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 bg-transparent border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10 font-bold text-sm tracking-wider uppercase rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center min-w-[80px]"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : (lang === 'es' ? 'APLICAR' : 'APPLY')}
        </button>
      </div>
      {message && (
        <p className={`text-xs font-bold tracking-wide ${message.type === 'success' ? 'text-[#39FF14]' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
