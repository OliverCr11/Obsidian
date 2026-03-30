import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, Loader2 } from 'lucide-react';
import type { Lang } from '../types';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default function VerifyEmailPage({ lang }: { lang: Lang }) {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${baseURL}/api/auth/verify/${token}/`);
        const data = await res.json();
        
        if (res.ok) {
          setStatus('success');
          setMessage(lang === 'es' ? 'Cuenta verificada exitosamente.' : 'Account verified successfully.');
        } else {
          setStatus('error');
          setMessage(data.error || data.message || (lang === 'es' ? 'Token inválido o expirado.' : 'Invalid or expired token.'));
        }
      } catch (err) {
        setStatus('error');
        setMessage(lang === 'es' ? 'Error de conexión HTTP.' : 'HTTP Connection error.');
      }
    };

    // Simulated short delay for UX aesthetic
    setTimeout(verifyEmail, 1500);
  }, [token, lang]);

  return (
    <div className="min-h-screen bg-obsidian-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-2xl border border-zinc-800 text-center max-w-md w-full relative z-10"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-kevin-violet animate-spin" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-white mt-4">
              {lang === 'es' ? 'Verificando Secuencia...' : 'Verifying Sequence...'}
            </h2>
            <p className="text-zinc-500 font-mono text-sm max-w-[200px]">
              {lang === 'es' ? 'Desencriptando y comprobando el token de acceso primario.' : 'Decrypting and validating primary access token.'}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">
              {lang === 'es' ? 'Acceso Concedido' : 'Access Granted'}
            </h2>
            <p className="text-zinc-400 font-mono text-sm mb-6">{message}</p>
            <button
              onClick={() => navigate('/auth')}
              className="w-full py-4 rounded bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {lang === 'es' ? 'Autenticar Ahora' : 'Authenticate Now'}
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <XCircle size={32} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">
              {lang === 'es' ? 'Fallo Crítico' : 'Critical Failure'}
            </h2>
            <p className="text-zinc-400 font-mono text-sm mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded border border-zinc-700 text-zinc-300 font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              {lang === 'es' ? 'Volver al Inicio' : 'Return to Core'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
