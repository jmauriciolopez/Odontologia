import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlanTratamiento } from '../types';

interface TratamientoProgresoProps {
  plan: PlanTratamiento;
  onUpdateEstado?: (itemId: string, estado: string) => void;
  isReadOnly?: boolean;
}

export const TratamientoProgreso: React.FC<TratamientoProgresoProps> = ({ plan, onUpdateEstado, isReadOnly = false }) => {
  const calculateProgress = (p: PlanTratamiento) => {
    if (!p.items || p.items.length === 0) return 0;
    const completed = p.items.filter(item => item.estado === 'realizado').length;
    return Math.round((completed / p.items.length) * 100);
  };

  const progress = calculateProgress(plan);

  return (
    <div className="flex flex-col gap-6">
      {/* Plan Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-blue-50/50 dark:bg-blue-500/5 rounded-3xl border border-blue-100/50 dark:border-blue-500/10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{plan.nombre}</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity size={14} className="text-blue-500" />
              {plan.items.length} Procedimientos
            </span>
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp size={14} className="text-emerald-500" />
              {progress}% Completado
            </span>
          </div>
        </div>
        
        {/* Large Progress bar inside the info card */}
        <div className="w-full sm:w-48 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
          />
        </div>
      </div>

      {/* Roadmap List */}
      <div className="space-y-6 relative ml-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
        {plan.items.map((item) => (
          <div key={item.id} className="relative pl-10">
            <div className={cn(
              "absolute left-0 top-1.5 h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-900 transition-all z-10",
              item.estado === 'realizado' 
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 scale-110 shadow-lg shadow-emerald-500/20" 
                : "border-slate-200 dark:border-slate-700 text-slate-300"
            )}>
              {item.estado === 'realizado' ? <CheckCircle2 size={14} /> : <div className="h-1.5 w-1.5 rounded-full bg-current" />}
            </div>
            
            <div className={cn(
              "p-4 rounded-2xl border transition-all hover:shadow-medical-hover",
              item.estado === 'realizado' 
                ? "bg-white dark:bg-slate-900/40 border-emerald-500/20" 
                : "bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800"
            )}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                    item.estado === 'realizado' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <h5 className={cn("text-sm font-bold", item.estado === 'realizado' ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white")}>
                      {item.tipo}
                    </h5>
                    {item.piezaPosicion && (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Pieza: {item.piezaPosicion} {item.cara && `• Cara: ${item.cara}`}
                      </p>
                    )}
                  </div>
                </div>

                {!isReadOnly && onUpdateEstado && (
                  <button 
                    onClick={() => {
                      const nextEstado = item.estado === 'pendiente' ? 'realizado' : 'pendiente';
                      onUpdateEstado(item.id, nextEstado);
                    }}
                    className={cn(
                      "text-[10px] font-bold px-4 py-2 rounded-xl border transition-all shrink-0",
                      item.estado === 'realizado'
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                        : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50"
                    )}
                  >
                    {item.estado === 'realizado' ? 'COMPLETADO' : 'MARCAR HECHO'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {plan.notas && (
        <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/30 dark:border-amber-500/10 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Notas Clínicas</span>
            <p className="text-xs text-amber-800/80 dark:text-amber-200/80 leading-relaxed italic mt-1">
              "{plan.notas}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
