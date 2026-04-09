import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, HeartPulse, Plus } from 'lucide-react';
import { Antecedente } from '../types';
import { cn } from '@/lib/utils';

interface AntecedentesListProps {
  antecedentes?: Antecedente[];
  onAdd?: () => void;
}

const CRITICAL_TYPES = ['alergia', 'cronica', 'cirugia', 'medicacion'];

export const AntecedentesList: React.FC<AntecedentesListProps> = ({ antecedentes = [], onAdd }) => {
  return (
    <div className="medical-card p-6 border-[var(--sb-border)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
            <HeartPulse size={18} />
          </div>
          <h3 className="font-bold text-[var(--sb-text)]">Antecedentes Médicos</h3>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
          >
            <Plus size={14} /> Agregar
          </button>
        )}
      </div>

      {antecedentes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {antecedentes.map((ant) => {
            const isCritical = CRITICAL_TYPES.includes(ant.tipo.toLowerCase());
            return (
              <motion.div
                key={ant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold border',
                  isCritical
                    ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'
                    : 'border-[var(--sb-border)] text-[var(--sb-text-muted)]'
                )}
              >
                {isCritical ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase tracking-wider opacity-70">{ant.tipo}</span>
                  <span>{ant.descripcion}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-2 bg-[var(--sb-active-bg)] rounded-2xl border border-dashed border-[var(--sb-border)]">
          <ShieldCheck size={22} className="text-emerald-400 opacity-50" />
          <p className="text-xs font-bold text-[var(--sb-text-muted)]">Sin antecedentes registrados</p>
        </div>
      )}
    </div>
  );
};
