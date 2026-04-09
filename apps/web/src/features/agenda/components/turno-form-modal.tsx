import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { format, addMinutes, parseISO } from 'date-fns';
import { Turno, CreateTurnoDto } from '../types';
import { useAgendaActions, useProfesionales, useConsultorios } from '../hooks/use-turnos';
import { useDisponibilidad } from '../hooks/use-disponibilidad';
import { cn } from '@/lib/utils';

interface TurnoFormModalProps {
  turno?: Turno;
  initialDate?: Date;
  onClose: () => void;
}

const ESTADOS = ['programado', 'confirmado', 'atendido', 'cancelado', 'ausente'] as const;

export const TurnoFormModal: React.FC<TurnoFormModalProps> = ({ turno, initialDate, onClose }) => {
  const isEdit = !!turno;
  const { createTurno, isCreating, updateTurno, isUpdating, deleteTurno, isDeleting } = useAgendaActions();
  const { data: profesionales = [] } = useProfesionales();
  const { data: consultorios  = [] } = useConsultorios();

  const defaultStart = initialDate ?? (turno ? parseISO(turno.fechaInicio) : new Date());
  const defaultEnd   = turno ? parseISO(turno.fechaFin) : addMinutes(defaultStart, 30);

  const [form, setForm] = useState({
    pacienteId:    turno?.pacienteId    ?? '',
    profesionalId: turno?.profesionalId ?? '',
    consultorioId: turno?.consultorioId ?? '',
    fechaInicio:   format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
    fechaFin:      format(defaultEnd,   "yyyy-MM-dd'T'HH:mm"),
    motivo:        turno?.motivo        ?? '',
    estado:        turno?.estado        ?? 'programado',
  });

  const { disponibilidad } = useDisponibilidad({
    fechaInicio:   form.fechaInicio,
    fechaFin:      form.fechaFin,
    profesionalId: form.profesionalId,
    consultorioId: form.consultorioId,
  });

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dto: CreateTurnoDto = {
      pacienteId:    form.pacienteId,
      profesionalId: form.profesionalId,
      consultorioId: form.consultorioId,
      fechaInicio:   new Date(form.fechaInicio).toISOString(),
      fechaFin:      new Date(form.fechaFin).toISOString(),
      motivo:        form.motivo || undefined,
      estado:        form.estado,
    };
    if (isEdit) {
      await updateTurno({ id: turno.id, data: dto });
    } else {
      await createTurno(dto);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!turno) return;
    await deleteTurno(turno.id);
    onClose();
  };

  const isBusy = isCreating || isUpdating || isDeleting;
  const hasConflict = disponibilidad && !disponibilidad.disponible && !isEdit;

  const inputCls = cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--sb-border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--sb-border)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--sb-text)' }}>
            {isEdit ? 'Editar Turno' : 'Nuevo Turno'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--sb-text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Paciente ID */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              ID Paciente
            </label>
            <input
              required
              value={form.pacienteId}
              onChange={e => set('pacienteId', e.target.value)}
              placeholder="UUID del paciente"
              className={inputCls}
              style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
            />
          </div>

          {/* Profesional */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              Profesional
            </label>
            <select
              required
              value={form.profesionalId}
              onChange={e => set('profesionalId', e.target.value)}
              className={inputCls}
              style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
            >
              <option value="">Seleccionar profesional</option>
              {profesionales.map(p => (
                <option key={p.id} value={p.id}>{p.usuario.nombre} {p.usuario.apellido}</option>
              ))}
            </select>
          </div>

          {/* Consultorio */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              Consultorio
            </label>
            <select
              required
              value={form.consultorioId}
              onChange={e => set('consultorioId', e.target.value)}
              className={inputCls}
              style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
            >
              <option value="">Seleccionar consultorio</option>
              {consultorios.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Fecha/hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
                Inicio
              </label>
              <input
                required type="datetime-local"
                value={form.fechaInicio}
                onChange={e => set('fechaInicio', e.target.value)}
                className={inputCls}
                style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
                Fin
              </label>
              <input
                required type="datetime-local"
                value={form.fechaFin}
                onChange={e => set('fechaFin', e.target.value)}
                className={inputCls}
                style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
              />
            </div>
          </div>

          {/* Estado (edit only) */}
          {isEdit && (
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
                Estado
              </label>
              <select
                value={form.estado}
                onChange={e => set('estado', e.target.value)}
                className={inputCls}
                style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
              >
                {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Motivo */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              Motivo (opcional)
            </label>
            <input
              value={form.motivo}
              onChange={e => set('motivo', e.target.value)}
              placeholder="Motivo de la consulta"
              className={inputCls}
              style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
            />
          </div>

          {/* Conflict warning */}
          {hasConflict && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              Conflicto de horario detectado para este profesional o consultorio.
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isBusy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 border border-rose-500/30 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Eliminar
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                style={{ color: 'var(--sb-text-muted)', background: 'var(--sb-active-bg)' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isBusy || !!hasConflict}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {(isCreating || isUpdating) ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isEdit ? 'Guardar Cambios' : 'Crear Turno'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
