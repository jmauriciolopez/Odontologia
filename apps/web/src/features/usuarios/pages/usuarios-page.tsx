import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, UserPlus, Search, Filter, Shield, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { useUsuarios } from '../hooks/use-usuarios';
import { UsuarioFormModal } from '../components/usuario-form-modal';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

export const UsuariosPage: React.FC = () => {
  const { usuarios, isLoading } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">Gestión de Usuarios</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Controla el acceso y roles de todo tu equipo clínico.</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </motion.button>
      </div>

      {/* Stats Cards (Mini) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard delay={0.1}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Equipo</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{usuarios.length}</h3>
            </div>
          </div>
        </PremiumCard>
        {/* Additional mini stats could go here */}
      </div>

      {/* Table Section */}
      <PremiumCard delay={0.2} className="overflow-hidden p-0 border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50">
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nombre or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-blue-500/30 rounded-xl py-2 pl-10 pr-4 text-sm outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-semibold">
            <Filter size={18} />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-left">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Roles</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-400/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-sm">
                          {user.nombre?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                            {user.nombre} {user.apellido}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Mail size={12} /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {user.usuarioRoles.map((ur) => (
                          <span key={ur.id} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
                            {ur.rol?.nombre}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {user.activo ? (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                          <CheckCircle2 size={14} /> Activo
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full w-fit">
                          <XCircle size={14} /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                        <Plus size={18} className="rotate-45" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PremiumCard>

      <UsuarioFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
