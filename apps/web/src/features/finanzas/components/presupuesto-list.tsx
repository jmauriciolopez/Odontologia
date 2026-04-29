import React from 'react';
import { motion } from 'framer-motion';
import { Presupuesto } from '../types';
import { CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, User, Play, Printer, FileDown } from 'lucide-react';
import { useFinanzasMutations } from '../hooks/use-presupuestos';
import { cn } from '@/lib/utils';
import { printPresupuesto } from './PresupuestoPrint';
import { httpClient } from '@/lib/Httpclient';
import { toast } from 'sonner';

interface PresupuestoListProps {
  presupuestos: Presupuesto[];
  isLoading: boolean;
  onSelect: (p: Presupuesto) => void;
  pacienteNombre?: string;
}

export const PresupuestoList: React.FC<PresupuestoListProps> = ({ presupuestos, isLoading, onSelect, pacienteNombre }) => {
  const { iniciarTratamiento } = useFinanzasMutations();
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Sincronizando presupuestos clínicos...</p>
      </div>
    );
  }

  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'pagado':
        return {
          icon: CheckCircle2,
          label: 'Pagado',
          bg: 'bg-emerald-50 dark:bg-emerald-500/10',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-100 dark:border-emerald-500/20'
        };
      case 'pagado_parcial':
        return {
          icon: Clock,
          label: 'Parcial',
          bg: 'bg-amber-50 dark:bg-amber-500/10',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-100 dark:border-amber-500/20'
        };
      case 'rechazado':
        return {
          icon: AlertCircle,
          label: 'Rechazado',
          bg: 'bg-rose-50 dark:bg-rose-500/10',
          text: 'text-rose-600 dark:text-rose-400',
          border: 'border-rose-100 dark:border-rose-500/20'
        };
      case 'iniciado':
        return {
          icon: Play,
          label: 'Iniciado',
          bg: 'bg-blue-50 dark:bg-blue-500/10',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-100 dark:border-blue-500/20'
        };
      default:
        return {
          icon: FileText,
          label: 'Pendiente',
          bg: 'bg-[var(--sb-active-bg)]',
          text: 'text-[var(--sb-text-muted)]',
          border: 'border-[var(--sb-border)]'
        };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'var(--card-bg)',
        border:     '1px solid var(--card-border)',
        boxShadow:  'var(--card-shadow)',
        backdropFilter: 'blur(var(--card-blur, 0px))',
      }}
    >      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead
            className="border-b"
            style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)' }}
          >
            <tr>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sb-text-muted)]">Presupuesto</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sb-text-muted)]">Paciente</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sb-text-muted)]">Total</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--sb-text-muted)]">Estado</th>
              <th className="p-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sb-border)]/50">
            {presupuestos.map((p, i) => {
              const status = getStatusConfig(p.estado);
              return (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors group-hover:text-blue-500"
                        style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text-muted)' }}>
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[var(--sb-text)]">#{p.folio || p.id.slice(0, 8).toUpperCase()}</span>
                        <span className="text-[10px] font-bold text-[var(--sb-text-muted)] uppercase tracking-wide">
                          {new Date(p.fechaPresupuesto).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <User size={14} />
                      </div>
                      <span className="font-semibold text-sm text-[var(--sb-text)]">
                        {p.paciente ? `${p.paciente.apellido}, ${p.paciente.nombre}` : 'Paciente Clínica'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-black text-[var(--sb-text)] tracking-tight">
                      {formatCurrency(p.total)}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-tight",
                      status.bg, status.text, status.border
                    )}>
                      <status.icon size={14} />
                      {status.label.toUpperCase()}
                    </div>
                  </td>
                  <td className="p-5 text-right flex items-center justify-end gap-2">
                    {p.estado === 'pendiente' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          iniciarTratamiento.mutate(p.id);
                        }}
                        disabled={iniciarTratamiento.isPending}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {iniciarTratamiento.isPending ? 'Iniciando...' : 'Iniciar'}
                        <Play size={14} />
                      </button>
                    )}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await httpClient.downloadFile(`/presupuestos/${p.id}/export-pdf`, `presupuesto-${p.folio || p.id.slice(0, 8)}.pdf`);
                          toast.success('Presupuesto exportado correctamente');
                        } catch (err) {
                          console.error(err);
                          toast.error('Error al exportar presupuesto');
                        }
                      }}
                      title="Descargar PDF Oficial"
                      className="inline-flex items-center gap-2 border-2 border-blue-100 dark:border-blue-500/20 hover:border-blue-500 px-3 py-2 rounded-xl text-xs font-bold transition-all text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/5"
                    >
                      <FileDown size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); printPresupuesto(p, undefined, pacienteNombre); }}
                      title="Imprimir Rápido (Navegador)"
                      className="inline-flex items-center gap-2 border-2 border-[var(--sb-border)] hover:border-slate-400 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:text-slate-600"
                      style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text-muted)' }}
                    >
                      <Printer size={14} />
                    </button>
                    <button
                      onClick={() => onSelect(p)}
                      className="inline-flex items-center gap-2 border-2 border-[var(--sb-border)] hover:border-blue-500 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:text-blue-600 group/btn"
                      style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text-muted)' }}
                    >
                      Gestionar
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {presupuestos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
             <div className="h-20 w-20 rounded-full flex items-center justify-center mb-6"
               style={{ background: 'var(--sb-active-bg)' }}>
                <FileText size={40} style={{ color: 'var(--sb-border)' }} />
             </div>
             <h3 className="font-bold text-[var(--sb-text)] mb-1">Sin Registros</h3>
             <p className="text-slate-500 text-sm max-w-[280px]">
               No hay presupuestos generados aún. Comience creando uno nuevo para sus pacientes.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};
