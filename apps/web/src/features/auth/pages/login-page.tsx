import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { httpClient } from '../../../lib/Httpclient';
import { useAuth } from '../../../context/auth-context';
import { Eye, EyeOff, Lock, Mail, Loader2, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response: any = await httpClient.post('auth/login', { email, password });
      // Con httpClient y auto-unwrap, response ya es { access_token, user }
      login(response.access_token, response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 font-sans text-slate-100">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]" />
        <div className="h-full w-full opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[440px]"
      >
        <div className="glass rounded-3xl p-8 backdrop-blur-2xl md:p-10 bg-slate-900/40 border border-slate-800">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl shadow-xl shadow-primary/20"
            >
              🦷
            </motion.div>
            <div className="space-y-1">
              <h1 className="font-heading text-3xl font-bold tracking-tight">OdontoSaaS</h1>
              <p className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <Sparkles size={14} className="text-blue-400" />
                Gestión clínica inteligente
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" size={18} />
                <input
                  type="email"
                  className="input-clinical pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@odontologia.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contraseña</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-clinical pl-11 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-medium text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg p-2.5"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-primary/20 group"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Iniciar Sesión'}
              </div>
            </button>
          </form>

          {window.location.hostname === 'localhost' && (
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@odontologia.com');
                  setPassword('Admin123!');
                }}
                className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
              >
                🚀 Cargar Credenciales Demo
              </button>
            </div>
          )}
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-500">
          &copy; 2026 Antigravity Labs. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  );
};
