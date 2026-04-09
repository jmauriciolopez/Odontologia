import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HeartPulse, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIPOS = [
  { value: 'alergia',     label: 'Alergia',          color: 'rose' },
  { value: 'cronica',     label: 'Enfermedad Crónica', color: 'amber' },
  { value: 'cirugia',     label: 'Cirugía Previa',    color: 'violet' },
  { value: 'medicacion',  label: 'Medicación',        color: 'blue' },
  { value: 'familiar',    label: 'Antecedente Familiar', color: 'emerald' },
  { value: 'otro',        label: 'Otro',              color: 'slate' },
];

interface AntecedenteModalProps {
  fichaId: string;
  onClose: () => void;
  onSubmit: (data: { fichaId: string; tipo: string; descripcion: string }) => Promise<void>;
  loading?: boolean;
}

const inputCls = 'w-full rounded-xl border border-[var(--sb-border)] bg-[var(--sb-active-bg)]/60 px-4 py-2.5 text-sm font-medium text-[var(--sb-text)] placeholder-slate-400 outline-none transition-all focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/10';

export const AntecedenteModal: React.FC<AntecedenteModalProps> = ({ fichaId, onClose, onSubmit, loading }) => {
  const [tipo, setTipo]             = useState('alergia');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) return;
    await onSubmit({ fichaId, tipo, descripcion: descripcion.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[var(--card-bg)] rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--sb-border)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-500/20">
              <HeartPulse size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-[var(--sb-text)] uppercase">
                Nuevo Antecedente
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">
                Historial médico del paciente
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[var(--sb-text-muted)] transition-colors hover:opacity-80">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Tipo de Antecedente</label>
            <div className="grid grid-cols-3 gap-2">
              {TIPOS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTipo(t.value)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border-2 transition-all',
                    tipo === t.value
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'border-[var(--sb-border)] text-[var(--sb-text-muted)] hover:border-slate-300'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Descripción *</label>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Ej: Alergia a la penicilina, reacción severa..."
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[var(--sb-border)] py-3 text-sm font-bold text-[var(--sb-text-muted)] transition-colors hover:opacity-80"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !descripcion.trim()}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-500 transition-colors disabled:opacity-60"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                : 'Registrar Antecedente'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
