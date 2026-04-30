import { useState, useId } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import type { Lang } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AuthPageProps {
  lang: Lang;
  onBack: () => void;
}

type AuthTab = 'login' | 'register';

// ─── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  es: {
    loginTitle:    'Bienvenido al Core',
    loginSub:      'Accede a tu cuenta Obsidian.',
    registerTitle: 'Únete al Drop',
    registerSub:   'Crea tu cuenta. Sé parte del primer lote.',
    tabLogin:      'Iniciar Sesión',
    tabRegister:   'Registrarse',
    name:          'Nombre completo',
    email:         'Correo electrónico',
    password:      'Contraseña',
    confirmPwd:    'Confirmar contraseña',
    loginBtn:      'Entrar',
    registerBtn:   'Crear Cuenta',
    google:        'Continuar con Google',
    forgotPwd:     '¿Olvidaste tu contraseña?',
    hasAccount:    '¿Ya tienes cuenta?',
    noAccount:     '¿No tienes cuenta?',
    back:          'Volver a la tienda',
    // Validation
    errEmail:     'Ingresa un correo válido.',
    errPwdLen:    'Mínimo 8 caracteres.',
    errPwdMatch:  'Las contraseñas no coinciden.',
    errName:      'Ingresa tu nombre.',
    errRequired:  'Este campo es obligatorio.',
  },
  en: {
    loginTitle:    'Welcome to the Core',
    loginSub:      'Access your Obsidian account.',
    registerTitle: 'Join the Drop',
    registerSub:   'Create your account. Be part of the first batch.',
    tabLogin:      'Sign In',
    tabRegister:   'Register',
    name:          'Full name',
    email:         'Email address',
    password:      'Password',
    confirmPwd:    'Confirm password',
    loginBtn:      'Sign In',
    registerBtn:   'Create Account',
    google:        'Continue with Google',
    forgotPwd:     'Forgot your password?',
    hasAccount:    'Already have an account?',
    noAccount:     "Don't have an account?",
    back:          'Back to store',
    // Validation
    errEmail:     'Enter a valid email address.',
    errPwdLen:    'Minimum 8 characters required.',
    errPwdMatch:  'Passwords do not match.',
    errName:      'Please enter your name.',
    errRequired:  'This field is required.',
  },
} as const;

// ─── Framer-motion Variants ───────────────────────────────────────────────────

const pageVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const } },
  exit:    { opacity: 0, scale: 0.96, y: -20,
    transition: { duration: 0.25, ease: 'easeIn' as const } },
};

const tabContentVariants: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.32, ease: 'easeOut' as const } },
  exit:    { opacity: 0, x: -24,
    transition: { duration: 0.2, ease: 'easeIn' as const } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon: React.ReactNode;
  suffix?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
}

function InputField({ id, label, type, value, onChange, error, icon, suffix, placeholder, autoComplete }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
        {label}
      </label>
      <div className="relative">
        {/* Left icon */}
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={[
            'w-full bg-zinc-900/80 text-obsidian-text placeholder-zinc-600',
            'pl-11 pr-11 py-3.5 rounded-lg text-sm',
            'border transition-all duration-200 outline-none',
            'focus:ring-2 focus:ring-kevin-base/60 focus:border-kevin-base/60',
            error
              ? 'border-red-500/50 focus:ring-red-500/40 focus:border-red-500/50'
              : 'border-zinc-800 hover:border-zinc-700',
          ].join(' ')}
        />
        {/* Right suffix (e.g. password toggle) */}
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {suffix}
          </span>
        )}
      </div>
      {/* Inline validation error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-red-400"
        >
          <AlertCircle size={11} strokeWidth={2} />
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Google Icon SVG (minimalist)
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.36 7.74 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.74 1 4 3.64 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuthPage({ lang, onBack }: AuthPageProps) {
  const c = copy[lang];
  const uid = useId();
  const { login, register, loading, error: authError } = useAuth();

  const [tab, setTab] = useState<AuthTab>('login');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Login state
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPwd,   setLoginPwd]         = useState('');
  const [showLoginPwd, setShowLoginPwd]   = useState(false);
  const [loginErrors, setLoginErrors]     = useState<Record<string, string>>({});

  // ── Register state
  const [regName,    setRegName]          = useState('');
  const [regEmail,   setRegEmail]         = useState('');
  const [regPwd,     setRegPwd]           = useState('');
  const [regConfirm, setRegConfirm]       = useState('');
  const [showRegPwd,  setShowRegPwd]      = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [regErrors,  setRegErrors]        = useState<Record<string, string>>({});

  // ── Tab change — clear errors
  function switchTab(t: AuthTab) {
    setTab(t);
    setLoginErrors({});
    setRegErrors({});
  }

  // ── Login submit
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(''); // Clear success alerts prior to logic stream
    const errs: Record<string, string> = {};
    if (!loginEmail)             errs.email = c.errRequired;
    else if (!isValidEmail(loginEmail)) errs.email = c.errEmail;
    if (!loginPwd)               errs.pwd   = c.errRequired;
    else if (loginPwd.length < 8) errs.pwd  = c.errPwdLen;
    setLoginErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      const success = await login(loginEmail, loginPwd);
      if (success) {
        onBack();
      } else {
        setLoginErrors({ form: 'Invalid credentials. Please attempt again.' });
      }
    }
  }

  // ── Register submit
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!regName.trim())              errs.name    = c.errName;
    if (!regEmail)                    errs.email   = c.errRequired;
    else if (!isValidEmail(regEmail)) errs.email   = c.errEmail;
    if (!regPwd)                      errs.pwd     = c.errRequired;
    else if (regPwd.length < 8)       errs.pwd     = c.errPwdLen;
    if (regConfirm !== regPwd)        errs.confirm = c.errPwdMatch;
    setRegErrors(errs);
    
    if (Object.keys(errs).length === 0) {
      const success = await register(regEmail, regPwd, regName);
      if (success) {
        setSuccessMsg('Account created successfully!');
        setRegName('');
        setRegEmail('');
        setRegPwd('');
        setRegConfirm('');
        setTab('login');
      }
    }
  }

  // ── Password eye icon helper
  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={show ? 'Hide password' : 'Show password'}
      className="text-zinc-500 hover:text-zinc-300 transition-colors"
    >
      {show ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-obsidian-black flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* ── Ambient background glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Back button ── */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-white text-sm font-medium transition-colors group"
      >
        <ArrowLeft size={16} strokeWidth={2} className="group-hover:-translate-x-0.5 transition-transform" />
        {c.back}
      </motion.button>

      {/* ── Brand mark ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <span
          className="text-2xl font-black tracking-[0.3em] text-white uppercase"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            textShadow: '0 0 30px rgba(139,92,246,0.45)',
          }}
        >
          OBSIDIAN
        </span>
      </motion.div>

      {/* ── Main card ── */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className={[
          'w-full max-w-md relative',
          'bg-black/70 backdrop-blur-2xl',
          'rounded-2xl',
          'border border-zinc-800/70',
          'overflow-hidden',
        ].join(' ')}
        style={{ boxShadow: '0 0 60px rgba(139,92,246,0.08), 0 25px 50px rgba(0,0,0,0.8)' }}
      >
        {/* Violet top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-kevin-base/60 to-transparent" />

        {/* ── Tab switcher ── */}
        <div className="flex border-b border-zinc-800/60">
          {(['login', 'register'] as AuthTab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={[
                'flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-colors relative',
                tab === t ? 'text-white' : 'text-zinc-500 hover:text-zinc-300',
              ].join(' ')}
            >
              {t === 'login' ? c.tabLogin : c.tabRegister}
              {/* Active indicator */}
              {tab === t && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-kevin-base"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Form area ── */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.div
                key="login"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="mb-7">
                  <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                    {c.loginTitle}
                  </h1>
                  <p className="text-zinc-500 text-sm">{c.loginSub}</p>
                </div>

                {successMsg && (
                  <div className="p-3 mb-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono tracking-widest text-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                     {successMsg}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} noValidate className="space-y-4">
                  <InputField
                    id={`${uid}-login-email`}
                    label={c.email}
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    error={loginErrors.email}
                    icon={<Mail size={16} strokeWidth={1.5} />}
                    placeholder="hola@obsidian.ec"
                    autoComplete="email"
                  />
                  <InputField
                    id={`${uid}-login-pwd`}
                    label={c.password}
                    type={showLoginPwd ? 'text' : 'password'}
                    value={loginPwd}
                    onChange={setLoginPwd}
                    error={loginErrors.pwd}
                    icon={<Lock size={16} strokeWidth={1.5} />}
                    suffix={eyeBtn(showLoginPwd, () => setShowLoginPwd((v) => !v))}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />

                  {/* Error Notification */}
                  {(loginErrors.form || authError) && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono tracking-widest text-center mt-2">
                       {loginErrors.form || authError}
                    </div>
                  )}

                  {/* Forgot password */}
                  <div className="flex justify-end mt-2">
                    <button type="button" className="text-xs text-zinc-500 hover:text-kevin-glow transition-colors">
                      {c.forgotPwd}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 mt-2 rounded-lg font-black text-sm tracking-[0.12em] uppercase text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      animation: 'pulse-glow 3s cubic-bezier(0.4,0,0.6,1) infinite',
                      boxShadow: '0 0 25px rgba(139,92,246,0.35)',
                    }}
                  >
                    {loading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> : c.loginBtn}
                  </button>

                  {/* Divider */}
                  {/* Google OAuth Disabled for Beta v1.0
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-zinc-800" />
                    <span className="text-zinc-600 text-xs font-mono">OR</span>
                    <div className="flex-1 h-px bg-zinc-800" />
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-zinc-700 text-sm font-medium text-zinc-300 transition-all duration-200"
                  >
                    <GoogleIcon />
                    {c.google}
                  </button>
                  */}
                </form>

                {/* Switch to register */}
                <p className="text-center text-xs text-zinc-600 mt-6">
                  {c.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('register')}
                    className="text-kevin-glow hover:underline font-semibold transition-colors"
                  >
                    {c.tabRegister}
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="mb-7">
                  <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                    {c.registerTitle}
                  </h1>
                  <p className="text-zinc-500 text-sm">{c.registerSub}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleRegister} noValidate className="space-y-4">
                  <InputField
                    id={`${uid}-reg-name`}
                    label={c.name}
                    type="text"
                    value={regName}
                    onChange={setRegName}
                    error={regErrors.name}
                    icon={<User size={16} strokeWidth={1.5} />}
                    placeholder="Oliver Cruz"
                    autoComplete="name"
                  />
                  <InputField
                    id={`${uid}-reg-email`}
                    label={c.email}
                    type="email"
                    value={regEmail}
                    onChange={setRegEmail}
                    error={regErrors.email}
                    icon={<Mail size={16} strokeWidth={1.5} />}
                    placeholder="hola@obsidian.ec"
                    autoComplete="email"
                  />
                  <InputField
                    id={`${uid}-reg-pwd`}
                    label={c.password}
                    type={showRegPwd ? 'text' : 'password'}
                    value={regPwd}
                    onChange={setRegPwd}
                    error={regErrors.pwd}
                    icon={<Lock size={16} strokeWidth={1.5} />}
                    suffix={eyeBtn(showRegPwd, () => setShowRegPwd((v) => !v))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <InputField
                    id={`${uid}-reg-confirm`}
                    label={c.confirmPwd}
                    type={showConfirm ? 'text' : 'password'}
                    value={regConfirm}
                    onChange={setRegConfirm}
                    error={regErrors.confirm}
                    icon={<Lock size={16} strokeWidth={1.5} />}
                    suffix={eyeBtn(showConfirm, () => setShowConfirm((v) => !v))}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />

                  {/* Password strength hint */}
                  {regPwd.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-1.5 mt-1"
                    >
                      {[1, 2, 3, 4].map((level) => {
                        const strength = Math.min(4, Math.floor(regPwd.length / 3));
                        const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                              level <= strength ? colors[strength - 1] : 'bg-zinc-800'
                            }`}
                          />
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Error Notification */}
                  {(regErrors.form || authError) && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono tracking-widest text-center mt-2">
                       {regErrors.form || authError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-4 mt-2 rounded-lg font-black text-sm tracking-[0.12em] uppercase text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      animation: 'pulse-glow 3s cubic-bezier(0.4,0,0.6,1) infinite',
                      boxShadow: '0 0 25px rgba(139,92,246,0.35)',
                    }}
                  >
                    {loading ? <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"/> : c.registerBtn}
                  </button>

                  {/* Divider */}
                  {/* Google OAuth Disabled for Beta v1.0
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-zinc-800" />
                    <span className="text-zinc-600 text-xs font-mono">OR</span>
                    <div className="flex-1 h-px bg-zinc-800" />
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/60 hover:border-zinc-700 text-sm font-medium text-zinc-300 transition-all duration-200"
                  >
                    <GoogleIcon />
                    {c.google}
                  </button>
                  */}
                </form>

                {/* Switch to login */}
                <p className="text-center text-xs text-zinc-600 mt-6">
                  {c.hasAccount}{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="text-kevin-glow hover:underline font-semibold transition-colors"
                  >
                    {c.tabLogin}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom violet accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-kevin-base/30 to-transparent" />
      </motion.div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
        className="mt-8 text-xs text-zinc-700 font-mono text-center"
      >
        © 2026 Obsidian · Absolute Leather. Dark Performance.
      </motion.p>
    </div>
  );
}
