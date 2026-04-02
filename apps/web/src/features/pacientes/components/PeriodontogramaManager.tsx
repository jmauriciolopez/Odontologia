import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Table, 
  Activity, 
  Stethoscope, 
  ChevronRight, 
  ChevronLeft,
  Droplets,
  Microscope,
  Save,
  Loader2
} from 'lucide-react';
import { MedicionPeriodontal } from '../types';
import { usePeriodontogramaMutations } from '../hooks/use-periodontograma';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

interface PeriodontogramaManagerProps {
  fichaId: string;
  pacienteId: string;
  mediciones?: MedicionPeriodontal[];
}

export const PeriodontogramaManager: React.FC<PeriodontogramaManagerProps> = ({ 
  fichaId, 
  pacienteId,
  mediciones = [] 
}) => {
  const [activeArch, setActiveArch] = useState<'superior' | 'inferior'>('superior');
  const { upsertMedicion } = usePeriodontogramaMutations(pacienteId);

  const teethSuperior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const teethInferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  const currentTeeth = activeArch === 'superior' ? teethSuperior : teethInferior;

  const getMedicion = (posicion: number) => mediciones.find(m => m.posicionDiente === posicion);

  const handleInputChange = (diente: number, field: string, value: any) => {
    const existing = getMedicion(diente) || {};
    upsertMedicion.mutate({
      fichaId,
      diente,
      data: { ...existing, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Mapeo Gingival</h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Sondaje Periodontal Completo</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl items-center gap-1 shadow-inner">
           <button 
             onClick={() => setActiveArch('superior')}
             className={cn(
               "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
               activeArch === 'superior' ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-400"
             )}
           >
             Arcada Superior
           </button>
           <button 
             onClick={() => setActiveArch('inferior')}
             className={cn(
               "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
               activeArch === 'inferior' ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-400"
             )}
           >
             Arcada Inferior
           </button>
        </div>
      </div>

      {/* Periodontal Table */}
      <div className="medical-card p-0 overflow-hidden bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/5">
         <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                     <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-32">Parámetro</th>
                     {currentTeeth.map(t => (
                        <th key={t} className="px-4 py-6 min-w-[80px]">
                           <div className="h-10 w-10 mx-auto rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/20">
                             {t}
                           </div>
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-bold text-xs">
                  {/* Recesión Vestibular */}
                  <tr className="group hover:bg-slate-50/30 transition-colors">
                     <td className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-left sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50/30 z-10">Recesión (V)</td>
                     {currentTeeth.map(t => {
                        const m = getMedicion(t);
                        return (
                           <td key={t} className="px-2 py-4">
                              <div className="flex justify-center gap-1">
                                 <PerioInput value={m?.recesionVestibularDistal} onChange={(v) => handleInputChange(t, 'recesionVestibularDistal', v)} />
                                 <PerioInput value={m?.recesionVestibularMedio} onChange={(v) => handleInputChange(t, 'recesionVestibularMedio', v)} highlight />
                                 <PerioInput value={m?.recesionVestibularMesial} onChange={(v) => handleInputChange(t, 'recesionVestibularMesial', v)} />
                              </div>
                           </td>
                        );
                     })}
                  </tr>
                  {/* Profundidad Vestibular */}
                  <tr className="group hover:bg-slate-50/30 transition-colors bg-blue-50/10">
                     <td className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-blue-500 text-left sticky left-0 bg-blue-50/10 dark:bg-blue-500/5 group-hover:bg-blue-50/30 z-10">Bolsa (V)</td>
                     {currentTeeth.map(t => {
                        const m = getMedicion(t);
                        return (
                           <td key={t} className="px-2 py-4">
                              <div className="flex justify-center gap-1">
                                 <PerioInput value={m?.profundidadVestibularDistal} onChange={(v) => handleInputChange(t, 'profundidadVestibularDistal', v)} variant="blue" />
                                 <PerioInput value={m?.profundidadVestibularMedio} onChange={(v) => handleInputChange(t, 'profundidadVestibularMedio', v)} variant="blue" highlight />
                                 <PerioInput value={m?.profundidadVestibularMesial} onChange={(v) => handleInputChange(t, 'profundidadVestibularMesial', v)} variant="blue" />
                              </div>
                           </td>
                        );
                     })}
                  </tr>
                  {/* Sangrado / Placa */}
                  <tr className="group hover:bg-slate-50/30 transition-colors">
                     <td className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-left sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50/30 z-10">Estado</td>
                     {currentTeeth.map(t => {
                        const m = getMedicion(t);
                        return (
                           <td key={t} className="px-4 py-4">
                              <div className="flex justify-center gap-2">
                                 <button 
                                    onClick={() => handleInputChange(t, 'sangrado', !m?.sangrado)}
                                    className={cn(
                                       "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                                       m?.sangrado ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-slate-100 text-slate-300"
                                    )}
                                    title="Sangrado"
                                 >
                                    <Droplets size={14} />
                                 </button>
                                 <button 
                                    onClick={() => handleInputChange(t, 'placa', !m?.placa)}
                                    className={cn(
                                       "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                                       m?.placa ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-slate-100 text-slate-300"
                                    )}
                                    title="Placa"
                                 >
                                    <Microscope size={14} />
                                 </button>
                              </div>
                           </td>
                        );
                     })}
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

      {/* Info Card */}
      <PremiumCard className="p-6 bg-slate-900 border-none">
         <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
               <Activity size={24} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-white uppercase tracking-tight">Interpretación de Datos</h4>
               <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Las mediciones marcadas en <span className="text-rose-400">rojo</span> indican profundidades mayores a 3mm, sugiriendo bolsas periodontales activas. 
                  El control de placa y sangrado es crítico para el éxito del tratamiento.
               </p>
            </div>
         </div>
      </PremiumCard>
    </div>
  );
};

const PerioInput = ({ value, onChange, highlight, variant = 'slate' }: { value?: number, onChange: (v: number) => void, highlight?: boolean, variant?: 'slate' | 'blue' }) => {
   const isWarning = (value || 0) > 3;
   
   return (
      <input 
         type="number"
         min={0}
         max={15}
         value={value || 0}
         onChange={(e) => onChange(parseInt(e.target.value))}
         className={cn(
            "w-8 h-8 rounded-lg text-center font-black text-xs outline-none transition-all border-2",
            highlight ? "border-slate-200 dark:border-slate-700" : "border-transparent",
            variant === 'blue' ? "bg-blue-500/5 text-blue-600 focus:border-blue-500" : "bg-slate-100 dark:bg-slate-800 text-slate-600 focus:border-slate-400",
            isWarning && "text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200"
         )}
      />
   );
};
