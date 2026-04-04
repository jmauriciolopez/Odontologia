import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOdontograma, useOdontogramaMutations } from '../hooks/use-odontograma';
import { OdontogramaView } from './odontograma-view';
import { Odontograma3D } from './Odontograma3D';
import { PiezaDental } from '../types';
import { Info, Activity, Stethoscope, Loader2, Box, LayoutGrid, Plus as PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OdontogramaManagerProps {
  fichaId: string;
  isReadOnly?: boolean;
}

export const OdontogramaManager: React.FC<OdontogramaManagerProps> = ({ fichaId, isReadOnly = false }) => {
  const { data: piezas = [], isLoading } = useOdontograma(fichaId);
  const { updatePieza, addProcedimiento } = useOdontogramaMutations(fichaId);
  const [selectedPiezaId, setSelectedPiezaId] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(false);

  // Derivamos la pieza seleccionada de la data para mantener reactividad tras mutaciones
  const selectedPieza = piezas.find(p => p.id === selectedPiezaId) || null;

  const handleUpdateCara = async (cara: string, estado: string) => {
    if (isReadOnly || !selectedPieza) return;
    await updatePieza.mutateAsync({
      piezaId: selectedPieza.id,
      caras: { [cara]: estado }
    });
  };

  const states = [
    { id: 'sano', label: 'Sano', color: '#fff', bg: 'bg-white' },
    { id: 'caries', label: 'Caries', color: '#ef4444', bg: 'bg-rose-500' },
    { id: 'restauracion', label: 'Restauración', color: '#10b981', bg: 'bg-emerald-500' },
    { id: 'ausente', label: 'Ausente', color: '#cbd5e1', bg: 'bg-slate-300' },
    { id: 'corona', label: 'Corona', color: '#f59e0b', bg: 'bg-amber-500' },
  ];

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      {/* Visualización Principal */}
      <div className="medical-card p-4 md:p-8 bg-white/50 backdrop-blur-sm shadow-medical overflow-hidden">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Stethoscope size={18} />
              </div>
              <h3 className="font-bold text-slate-800">Mapa Dental Interactivo</h3>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl items-center gap-1">
                 <button 
                  onClick={() => setShow3D(false)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    !show3D ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"
                  )}
                  title="Vista 2D"
                 >
                   <LayoutGrid size={16} />
                 </button>
                 <button 
                  onClick={() => setShow3D(true)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    show3D ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400"
                  )}
                  title="Vista 3D"
                 >
                   <Box size={16} />
                 </button>
              </div>
           </div>
        </div>
        
        {show3D ? (
          <Odontograma3D 
            piezas={piezas} 
            onPiezaSelect={(p) => setSelectedPiezaId(p.id)} 
            selectedPiezaId={selectedPiezaId || undefined} 
          />
        ) : (
          <OdontogramaView 
            piezas={piezas} 
            onPiezaSelect={(p) => setSelectedPiezaId(p.id)} 
            selectedPiezaId={selectedPiezaId || undefined} 
          />
        )}
      </div>

      {/* Panel Lateral de Gestión */}
      <aside className="flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {selectedPieza ? (
            <motion.div 
              key={selectedPieza.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="medical-card p-6 flex flex-col gap-6 border-primary/20 bg-white shadow-xl shadow-primary/5 h-full max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/30">
                    {selectedPieza.posicion}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 tracking-tight">Pieza {selectedPieza.posicion}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Gestión Clínica Activa</p>
                  </div>
                </div>
              </div>

              {/* Hallazgos por Cara */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 border-b border-slate-50 pb-2">
                  <Activity size={16} className="text-primary" />
                  Hallazgos por Cara
                </div>
                
                <div className="grid gap-4">
                  {['vestibular', 'lingual', 'oclusal', 'distal', 'mesial'].map(cara => (
                    <div key={cara} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{cara}</label>
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          states.find(s => s.id === (selectedPieza.caras as any)[cara])?.bg || 'bg-slate-200'
                        )} />
                      </div>
                      <select 
                        disabled={isReadOnly || updatePieza.isPending}
                        className="input-clinical py-2.5 text-xs font-bold border-slate-200 hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                        value={(selectedPieza.caras as any)[cara]}
                        onChange={(e) => handleUpdateCara(cara, e.target.value)}
                      >
                        {states.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registro de Tratamiento */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <PlusIcon size={16} className="text-primary" />
                  Nuevo Tratamiento
                </div>
                <div className="flex gap-2">
                  <input 
                    id="new-proc-input"
                    placeholder="Ej: Limpieza, Amalgama..."
                    className="flex-1 input-clinical text-xs font-bold py-2.5"
                    disabled={addProcedimiento.isPending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.currentTarget as HTMLInputElement).value;
                        if (val) {
                          addProcedimiento.mutate({
                            piezaId: selectedPieza.id,
                            tipo: val,
                            observaciones: ''
                          });
                          (e.currentTarget as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('new-proc-input') as HTMLInputElement;
                      if (input.value) {
                        addProcedimiento.mutate({
                          piezaId: selectedPieza.id,
                          tipo: input.value,
                          observaciones: ''
                        });
                        input.value = '';
                      }
                    }}
                    disabled={addProcedimiento.isPending}
                    className="bg-primary text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Historial */}
              <div className="pt-4 border-t border-slate-100 space-y-4 pb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Info size={16} className="text-primary" />
                  Procedimientos Históricos
                </div>
                <div className="space-y-2">
                  {selectedPieza.procedimientos?.length ? selectedPieza.procedimientos.map(proc => (
                    <div key={proc.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:bg-white hover:shadow-sm">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{proc.tipo}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{new Date(proc.fechaRealizacion).toLocaleDateString()}</p>
                    </div>
                  )) : (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-100 text-center">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Sin registros</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="medical-card p-10 flex flex-col items-center justify-center text-center gap-5 bg-slate-50/50 border-dashed border-slate-200"
            >
              <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center text-4xl shadow-xl shadow-slate-200/50 border border-white">🦷</div>
              <div className="space-y-2">
                <p className="font-extrabold text-slate-800 tracking-tight">Pieza no seleccionada</p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                  InteractúE con el mapa dental para visualizar el historial y editar los hallazgos clínicos de cada pieza.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
};
