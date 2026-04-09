import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ChevronRight, Phone, FileText } from 'lucide-react';
import { Paciente } from '../types';
import { cn } from '@/lib/utils';

interface PacientesTableProps {
  pacientes: Paciente[];
  isLoading: boolean;
}

export const PacientesTable: React.FC<PacientesTableProps> = ({ pacientes, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="divide-y divide-[var(--sb-border)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-[var(--sb-active-bg)] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-[var(--sb-active-bg)] rounded w-1/3" />
              <div className="h-3 bg-[var(--sb-active-bg)] rounded w-1/4" />
            </div>
            <div className="h-3 bg-[var(--sb-active-bg)] rounded w-24" />
            <div className="h-3 bg-[var(--sb-active-bg)] rounded w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (pacientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-[var(--sb-active-bg)] flex items-center justify-center">
          <User size={28} className="text-slate-300 dark:text-slate-600" />
        </div>
        <div>
          <p className="font-bold text-[var(--sb-text)]">No se encontraron pacientes</p>
          <p className="text-xs text-[var(--sb-text-muted)] mt-1">Intentá con otro término o creá un nuevo paciente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-slate-50/60 bg-[var(--sb-active-bg)] border-b border-[var(--sb-border)]">
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Paciente</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Documento</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Teléfono</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Obra Social</th>
            <th className="px-6 py-4" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--sb-border)]/50">
          {pacientes.map((paciente, i) => (
            <motion.tr
              key={paciente.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/pacientes/${paciente.id}`)}
              className="group cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 text-sm shrink-0">
                    {paciente.nombre.charAt(0)}{paciente.apellido.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-[var(--sb-text)] truncate group-hover:text-blue-600 transition-colors">
                      {paciente.apellido}, {paciente.nombre}
                    </span>
                    <span className="text-xs text-[var(--sb-text-muted)] truncate">
                      {paciente.email || 'Sin email'}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-[var(--sb-text-muted)]">
                  {paciente.documento || '—'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--sb-text-muted)]">
                  {paciente.telefono
                    ? <><Phone size={13} className="text-slate-300" />{paciente.telefono}</>
                    : '—'
                  }
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-full",
                  paciente.obraSocial
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-[var(--sb-active-bg)] text-[var(--sb-text-muted)]"
                )}>
                  {paciente.obraSocial || 'Particular'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/pacientes/${paciente.id}`); }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--sb-text-muted)] hover:text-blue-600 transition-colors group-hover:text-blue-500"
                >
                  <FileText size={14} />
                  Ver Ficha
                  <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
