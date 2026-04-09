import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUsuarios } from '../hooks/use-usuarios';
import { Usuario, CreateUsuarioDto } from '../types';

interface UsuarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: Usuario | null;
}

export const UsuarioFormModal: React.FC<UsuarioFormModalProps> = ({ isOpen, onClose, editingUser }) => {
  const { roles, createUsuario, isCreating, updateUsuario, isUpdating } = useUsuarios();
  const isEdit = !!editingUser;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUsuarioDto & { rolIds: string[] }>({
    defaultValues: isEdit
      ? {
          nombre:   editingUser.nombre   ?? '',
          apellido: editingUser.apellido ?? '',
          email:    editingUser.email,
          rolIds:   editingUser.usuarioRoles.map(ur => ur.rolId),
        }
      : {},
  });

  // Reset form when switching between create/edit
  React.useEffect(() => {
    if (isOpen) {
      reset(
        isEdit
          ? {
              nombre:   editingUser.nombre   ?? '',
              apellido: editingUser.apellido ?? '',
              email:    editingUser.email,
              rolIds:   editingUser.usuarioRoles.map(ur => ur.rolId),
            }
          : { nombre: '', apellido: '', email: '', rolIds: [], password: '' }
      );
    }
  }, [isOpen, editingUser]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await updateUsuario({
          id: editingUser.id,
          data: {
            nombre:   data.nombre,
            apellido: data.apellido,
            activo:   editingUser.activo,
            rolIds:   Array.isArray(data.rolIds) ? data.rolIds : [data.rolIds],
          },
        });
        toast.success('Usuario actualizado correctamente');
      } else {
        await createUsuario({
          ...data,
          rolIds: Array.isArray(data.rolIds) ? data.rolIds : [data.rolIds],
        });
        toast.success('Usuario creado correctamente');
      }
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar el usuario');
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <div
                className="rounded-3xl overflow-hidden max-h-[calc(100vh-4rem)] flex flex-col"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--sb-text)' }}
              >

                {/* Header */}
                <div className="px-8 py-6 border-b border-[var(--sb-border)] flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-[var(--sb-text)] uppercase">
                      {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h2>
                    <p className="text-xs font-bold text-[var(--sb-text-muted)] uppercase tracking-widest mt-0.5">
                      {isEdit ? `Modificando: ${editingUser.email}` : 'Registrar nuevo miembro del equipo'}
                    </p>
                  </div>
                  <button onClick={onClose} className="p-2 rounded-xl hover:opacity-80 text-[var(--sb-text-muted)] transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5 overflow-y-auto">

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Nombre</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                          {...register('nombre', { required: 'Requerido' })}
                          className="input-premium py-2.5 pl-9 pr-4 text-sm"
                          placeholder="Juan"
                        />
                      </div>
                      {errors.nombre && <p className="text-[10px] text-rose-500">{errors.nombre.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Apellido</label>
                      <input
                        {...register('apellido', { required: 'Requerido' })}
                        className="input-premium py-2.5 px-4 text-sm"
                        placeholder="Pérez"
                      />
                      {errors.apellido && <p className="text-[10px] text-rose-500">{errors.apellido.message}</p>}
                    </div>
                  </div>

                  {/* Email — readonly on edit */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] group-focus-within:text-blue-500 transition-colors" size={16} />
                      <input
                        {...register('email', { required: !isEdit })}
                        type="email"
                        readOnly={isEdit}
                        className={`input-premium py-2.5 pl-9 pr-4 text-sm ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                        placeholder="juan@clinica.com"
                      />
                    </div>
                    {isEdit && <p className="text-[10px] text-[var(--sb-text-muted)]">El email no puede modificarse</p>}
                  </div>

                  {/* Roles */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Roles</label>
                    <div className="relative group">
                      <Shield className="absolute left-3 top-3 text-[var(--sb-text-muted)] group-focus-within:text-blue-500 transition-colors" size={16} />
                      <select
                        multiple
                        {...register('rolIds', { required: 'Seleccione al menos un rol' })}
                        className="input-premium py-2.5 pl-9 pr-4 text-sm h-24"
                      >
                        {roles.map((rol: any) => (
                          <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                        ))}
                      </select>
                    </div>
                    {errors.rolIds && <p className="text-[10px] text-rose-500">{String(errors.rolIds.message)}</p>}
                    <p className="text-[10px] text-[var(--sb-text-muted)]">Ctrl/Cmd + click para seleccionar múltiples</p>
                  </div>

                  {/* Password — only on create */}
                  {!isEdit && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Contraseña Temporal</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] group-focus-within:text-blue-500 transition-colors" size={16} />
                        <input
                          type="password"
                          {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                          className="input-premium py-2.5 pl-9 pr-4 text-sm"
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="text-[10px] text-rose-500">{errors.password.message}</p>}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-[var(--sb-text-muted)] transition-all hover:opacity-80 border border-[var(--sb-border)]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isPending
                        ? <><Loader2 className="animate-spin" size={16} /> Guardando...</>
                        : isEdit ? 'Guardar Cambios' : 'Crear Usuario'
                      }
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
