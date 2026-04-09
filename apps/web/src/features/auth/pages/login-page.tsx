import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Loader2, Activity, Shield, Stethoscope } from 'lucide-react';
import { useLogin } from '../hooks/use-login';

const FEATURES = [
  { icon: Stethoscope, label: 'Fichas clínicas digitales' },
  { icon: Activity,    label: 'Odontograma interactivo' },
  { icon: Shield,      label: 'Acceso seguro por roles' },
];

export const LoginPage: React.FC = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { submit, isLoading, error }    = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ email, password });
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 font-sans">

      {/* ── Left panel — branding ── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-14 overflow-hidden">

        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[80px]" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30 text-2xl">
            🦷
          </div>
          <span className="text-xl font-bold tracking-tight text-white">OdontoSaaS</span>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-10 space-y-8"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Plataforma clínica v2.0
            </div>
            <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-white">
              Gestión clínica<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                sin fricciones.
              </span>
            </h1>
            <p className="max-w-sm text-base font-medium leading-relaxed text-[var(--sb-text-muted)]">
              Centraliza fichas, turnos, odontogramas y finanzas en un solo sistema diseñado para clínicas modernas.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--sb-active-bg)] border border-[var(--sb-border)]">
                  <Icon size={15} className="text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-400">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 text-xs font-medium text-[var(--sb-text-muted)]"
        >
          © 2026 Antigravity Labs · Todos los derechos reservados
        </motion.p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">

        {/* Subtle right-side glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 right-0 h-[400px] w-[300px] rounded-full bg-blue-600/10 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-lg shadow-blue-600/30">
              🦷
            </div>
            <span className="text-lg font-bold text-white">OdontoSaaS</span>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-[var(--sb-border)] bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">

            <div className="mb-8 space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-white">Bienvenido de vuelta</h2>
              <p className="text-sm font-medium text-[var(--sb-text-muted)]">Ingresá tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">
                  Correo electrónico
                </label>
                <div className="group relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] transition-colors group-focus-within:text-blue-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="admin@clinica.com"
                    className="w-full rounded-xl border border-[var(--sb-border)] bg-slate-800/60 py-3 pl-10 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">
                  Contraseña
                </label>
                <div className="group relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] transition-colors group-focus-within:text-blue-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[var(--sb-border)] bg-slate-800/60 py-3 pl-10 pr-12 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--sb-text-muted)] transition-colors hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-400"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading
                    ? <><Loader2 size={16} className="animate-spin" /> Verificando...</>
                    : 'Iniciar sesión'
                  }
                </span>
                {/* Shine sweep */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </form>

            {/* Demo shortcut — only on localhost */}
            {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
              <div className="mt-6 border-t border-[var(--sb-border)] pt-5">
                <button
                  type="button"
                  onClick={() => { setEmail('admin@odontologia.com'); setPassword('Admin123!'); }}
                  className="w-full rounded-xl border border-[var(--sb-border)] bg-slate-800/40 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)] transition-all hover:border-slate-700 hover:bg-slate-800 hover:text-slate-300"
                >
                  🚀 Cargar credenciales demo
                </button>
              </div>
            )}
          </div>

          {/* Status indicator */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema operativo · Todos los servicios activos
          </div>
        </motion.div>
      </div>
    </div>
  );
};
