import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Filter, Shield, Mail, CheckCircle2, XCircle, Pencil, KeyRound, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { useUsuarios } from '../hooks/use-usuarios';
import { UsuarioFormModal } from '../components/usuario-form-modal';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';
import { Usuario } from '../types';
import { httpClient } from '@/lib/Httpclient';
import { toast } from 'sonner';

export const UsuariosPage: React.FC = () => {
  const { usuarios, isLoading } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState<'all' | 'activo' | 'inactivo'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsuarios = usuarios.filter(u => {
    const matchSearch =
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchActivo =
      filterActivo === 'all' ||
      (filterActivo === 'activo' && u.activo) ||
      (filterActivo === 'inactivo' && !u.activo);
    return matchSearch && matchActivo;
  });

  const handleOpenCreate = () => { setEditingUser(null); setIsModalOpen(true); };
  const handleOpenEdit = (user: Usuario) => { setEditingUser(user); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingUser(null); };

  // Cambio de clave
  const [pwModal, setPwModal] = useState<{ open: boolean; user: Usuario | null }>({ open: false, user: null });
  const [newPassword, setNewPassword] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  const [showPw, setShowPw] = useState(false);

  const handleOpenPw = (user: Usuario) => { setPwModal({ open: true, user }); setNewPassword(''); setShowPw(false); };
  const handleClosePw = () => { setPwModal({ open: false, user: null }); setNewPassword(''); };

  const handleSavePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwModal.user) return;
    setSavingPw(true);
    try {
      await httpClient.patch(`usuarios/${pwModal.user.id}/password`, { password: newPassword });
      toast.success('Contraseña actualizada');
      handleClosePw();
    } catch (err: any) {
      toast.error(err.message || 'Error al cambiar la contraseña');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-heading font-bold tracking-tight text-[var(--sb-text)]">Gestión de Usuarios</h1>
          <p className="text-[var(--sb-text-muted)] mt-1 font-medium">Controla el acceso y roles de todo tu equipo clínico.</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOpenCreate()}
          className="flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl"
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
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Total Equipo</p>
              <h3 className="text-2xl font-bold text-[var(--sb-text)]">{usuarios.length}</h3>
            </div>
          </div>
        </PremiumCard>
        {/* Additional mini stats could go here */}
      </div>

      {/* Table Section */}
      <PremiumCard delay={0.2} className="overflow-hidden p-0 border-none">
        <div
          className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ borderColor: 'var(--sb-border)', background: 'var(--sb-active-bg)' }}
        >
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-premium py-2 pl-10 pr-4 text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              showFilters
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-[var(--sb-text-muted)] hover:opacity-80'
            )}
            style={showFilters ? {} : { background: 'var(--sb-active-bg)', border: '1px solid var(--sb-border)' }}
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="px-6 pb-4 flex flex-wrap items-center gap-2 border-b" style={{ borderColor: 'var(--sb-border)' }}>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] mr-2">Estado:</span>
            {(['all', 'activo', 'inactivo'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterActivo(f)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                  filterActivo === f
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-[var(--sb-text-muted)] border border-[var(--sb-border)] hover:border-blue-400'
                )}
                style={filterActivo !== f ? { background: 'var(--sb-active-bg)' } : {}}
              >
                {f === 'all' ? 'Todos' : f}
              </button>
            ))}
            {filterActivo !== 'all' && (
              <button
                onClick={() => setFilterActivo('all')}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 ml-2"
              >
                Limpiar
              </button>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left" style={{ background: 'var(--sb-active-bg)' }}>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Roles</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Estado</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--sb-text-muted)] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--sb-border)' }}>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8">
                      <div className="h-4 rounded w-full opacity-20" />
                    </td>
                  </tr>
                ))
              ) : filteredUsuarios.length > 0 ? (
                filteredUsuarios.map((user) => (
                  <tr key={user.id} className="group transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-sm">
                          {user.nombre?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--sb-text)] leading-none">
                            {user.nombre} {user.apellido}
                          </span>
                          <span className="text-xs text-[var(--sb-text-muted)] flex items-center gap-1 mt-1">
                            <Mail size={12} /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {user.usuarioRoles.map((ur, idx) => (
                          <span key={ur.id ?? `${user.id}-role-${idx}`} className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-100 dark:border-blue-500/20">
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
                        <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit opacity-60"
                          style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text-muted)' }}>
                          <XCircle size={14} /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 rounded-lg text-[var(--sb-text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                          title="Editar usuario"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenPw(user)}
                          className="p-2 rounded-lg text-[var(--sb-text-muted)] hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                          title="Cambiar contraseña"
                        >
                          <KeyRound size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-[var(--sb-text-muted)]">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PremiumCard>

      <UsuarioFormModal isOpen={isModalOpen} onClose={handleClose} editingUser={editingUser} />

      {/* Modal cambio de contraseña */}
      <AnimatePresence>
        {pwModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClosePw}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--sb-border)', color: 'var(--sb-text)' }}
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--sb-border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600">
                    <KeyRound size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight">Cambiar Contraseña</h2>
                    <p className="text-[11px] text-[var(--sb-text-muted)] font-medium">
                      {pwModal.user?.nombre} {pwModal.user?.apellido}
                    </p>
                  </div>
                </div>
                <button onClick={handleClosePw} className="p-2 rounded-xl text-[var(--sb-text-muted)] hover:opacity-80">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSavePw} className="p-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoFocus
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="input-premium text-sm pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] hover:text-[var(--sb-text)] transition-colors"
                      tabIndex={-1}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={handleClosePw}
                    className="flex-1 py-3 rounded-xl border border-[var(--sb-border)] text-sm font-bold text-[var(--sb-text-muted)] hover:opacity-80">
                    Cancelar
                  </button>
                  <button type="submit" disabled={savingPw || newPassword.length < 6}
                    className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold disabled:opacity-60 transition-all">
                    {savingPw ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />}
                    Actualizar Contraseña
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
