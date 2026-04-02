import React from 'react';
import { motion } from 'framer-motion';
import { Antecedente } from '../types';
import { AlertTriangle, Plus, ShieldCheck, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AntecedentesAlertsProps {
  antecedentes?: Antecedente[];
  onAdd?: () => void;
}

export const AntecedentesAlerts: React.FC<AntecedentesAlertsProps> = ({ antecedentes = [], onAdd }) => {
  const criticalTypes = ['alergia', 'cronica', 'cirugia', 'medicacion'];
  
  return (
    <div className="medical-card p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
              <HeartPulse size={20} />
           </div>
           <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-none">Alertas Médicas</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Antecedentes Críticos</p>
           </div>
        </div>
        <button 
          onClick={onAdd}
          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-primary transition-all active:scale-90"
          title="Agregar antecedente"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid gap-3">
        {antecedentes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {antecedentes.map((ant) => {
              const isCritical = criticalTypes.includes(ant.tipo.toLowerCase());
              
              return (
                <motion.div 
                  key={ant.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all border",
                    isCritical 
                      ? "bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400" 
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  {isCritical ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                  <div className="flex flex-col">
                    <span className="uppercase tracking-tighter text-[9px] opacity-70 leading-none mb-0.5">{ant.tipo}</span>
                    <span className="leading-tight">{ant.descripcion}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center gap-3 bg-slate-50/50 dark:bg-slate-800/10 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
             <ShieldCheck size={24} className="text-emerald-500 opacity-50" />
             <p className="text-xs font-bold text-slate-400 italic">Sin antecedentes médicos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};
