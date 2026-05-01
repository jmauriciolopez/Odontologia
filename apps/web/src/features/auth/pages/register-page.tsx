import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LockSimple, 
  EnvelopeSimple, 
  CircleNotch, 
  Stethoscope,
  Buildings,
  User,
  ArrowRight,
  ShieldCheck,
  TrendUp,
  MagicWand
} from '@phosphor-icons/react';
import { useRegister } from '../hooks/use-register';
import { Link } from 'react-router-dom';

const STEPS_INFO = [
  { icon: Buildings,   title: 'Espacio de trabajo', desc: 'Identifica tu consultorio o clínica.' },
  { icon: User,        title: 'Tu perfil',         desc: 'Configura tu acceso como administrador.' },
  { icon: ShieldCheck, title: 'Privacidad total',  desc: 'Tus datos están protegidos y cifrados.' },
];

export const RegisterPage: React.FC = () => {
  const [clinicaNombre, setClinicaNombre] = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [nombre, setNombre]             = useState('');
  const [apellido, setApellido]         = useState('');
  
  const { submit, isLoading, error }    = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ clinicaNombre, email, password, nombre, apellido });
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950 font-sans">

      {/* ── Background Elements ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
      </div>

      <div className="relative flex w-full max-w-[1200px] mx-auto flex-col lg:flex-row items-center justify-center gap-12 px-6 py-12">
        
        {/* ── Left Side: Value Prop ── */}
        <div className="hidden lg:flex flex-col w-1/2 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-600/30 text-white">
              <Stethoscope size={28} weight="bold" />
            </div>
            <span className="font-heading text-2xl font-black tracking-tighter text-white">OdontoSaaS</span>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400"
            >
              <MagicWand size={14} weight="bold" />
              Empieza gratis hoy
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-heading text-6xl font-black leading-tight tracking-tighter text-white"
            >
              Potencia tu clínica<br />
              con la mejor <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">tecnología dental.</span>
            </motion.h1>
          </div>

          <div className="grid gap-6">
            {STEPS_INFO.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <step.icon size={20} weight="bold" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right Side: Register Form ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-[500px]"
        >
          <div className="rounded-[40px] border border-white/10 bg-slate-900/60 p-10 shadow-3xl shadow-black/50 backdrop-blur-2xl">
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="font-heading text-3xl font-black tracking-tighter text-white">Crea tu cuenta</h2>
              <p className="mt-2 text-sm font-medium text-slate-400">
                Únete a cientos de profesionales que ya confían en nosotros.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Clinic Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Nombre de la Clínica / Consultorio
                </label>
                <div className="group relative">
                  <Buildings
                    size={18}
                    weight="bold"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-400"
                  />
                  <input
                    type="text"
                    value={clinicaNombre}
                    onChange={e => setClinicaNombre(e.target.value)}
                    required
                    placeholder="Ej. Dental Care Center"
                    className="w-full rounded-2xl border border-white/5 bg-slate-800/40 py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800/60 focus:ring-4 focus:ring-blue-500/5"
                  />
                </div>
              </div>

              {/* Name & Surname Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    placeholder="Juan"
                    className="w-full rounded-2xl border border-white/5 bg-slate-800/40 py-4 px-5 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800/60 focus:ring-4 focus:ring-blue-500/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={e => setApellido(e.target.value)}
                    required
                    placeholder="Pérez"
                    className="w-full rounded-2xl border border-white/5 bg-slate-800/40 py-4 px-5 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800/60 focus:ring-4 focus:ring-blue-500/5"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Email del Administrador
                </label>
                <div className="group relative">
                  <EnvelopeSimple
                    size={18}
                    weight="bold"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="admin@tuclinica.com"
                    className="w-full rounded-2xl border border-white/5 bg-slate-800/40 py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800/60 focus:ring-4 focus:ring-blue-500/5"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Contraseña segura
                </label>
                <div className="group relative">
                  <LockSimple
                    size={18}
                    weight="bold"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-blue-400"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-white/5 bg-slate-800/40 py-4 pl-12 pr-4 text-sm font-medium text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-slate-800/60 focus:ring-4 focus:ring-blue-500/5"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-semibold text-rose-400"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-blue-600 py-4 text-sm font-black text-white shadow-2xl shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? (
                  <CircleNotch size={20} weight="bold" className="animate-spin" />
                ) : (
                  <>
                    Crear mi clínica
                    <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs font-medium text-slate-500">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <ShieldCheck size={16} /> Encriptación SSL
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <TrendUp size={16} /> 99.9% Uptime
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
