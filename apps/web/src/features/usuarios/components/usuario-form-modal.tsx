import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Lock, Loader2 } from 'lucide-react';
import { useUsuarios } from '../hooks/use-usuarios';
import { CreateUsuarioDto } from '../types';

interface UsuarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsuarioFormModal: React.FC<UsuarioFormModalProps> = ({ isOpen, onClose }) => {
  const { roles, createUsuario, isCreating } = useUsuarios();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUsuarioDto>();

  const onSubmit = async (data: CreateUsuarioDto) => {
    try {
      await createUsuario(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 transition-all"
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden max-h-[calc(100vh-4rem)] flex flex-col">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Nuevo Usuario</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Registra un nuevo miembro en el equipo</p>
                  </div>
                  <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                          {...register('nombre', { required: true })}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                          placeholder="Ej: Juan"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Apellido</label>
                      <input
                        {...register('apellido', { required: true })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl py-2.5 px-4 text-sm outline-none transition-all"
                        placeholder="Ej: Pérez"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Profesional</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                        placeholder="juan@clinica.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Rol en la Clínica</label>
                    <div className="relative group">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <select
                        multiple
                        {...register('rolIds', { required: 'Seleccione al menos un rol' })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all h-24 ring-offset-white dark:ring-offset-slate-950 focus:ring-2 focus:ring-blue-500/20"
                      >
                        {roles.map((rol: any) => (
                          <option key={rol.id} value={rol.id} className="py-1">{rol.nombre}</option>
                        ))}
                      </select>
                    </div>
                    {errors.rolIds && <p className="text-[10px] text-rose-500 ml-1">{errors.rolIds.message}</p>}
                    <p className="text-[10px] text-slate-400 ml-1">Mantén presionado Ctrl (Cmd) para seleccionar múltiples</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Contraseña Temporal</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        type="password"
                        {...register('password', { required: true, minLength: 6 })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      {isCreating ? <Loader2 className="animate-spin" size={18} /> : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
