import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  Stethoscope,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useTratamientos } from '../hooks/use-tratamientos';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';
import { PlanTratamiento } from '../types';
import { TratamientoProgreso } from '../components/TratamientoProgreso';

export const TratamientosPage: React.FC = () => {
  const { planes, isLoading, updateItemEstado } = useTratamientos(); // Global view (backend needs to support findAll or similar, for now we will adapt)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const activePlanes = planes.filter((p: PlanTratamiento) => p.estado === 'activo');
  const filteredPlanes = activePlanes.filter((p: PlanTratamiento) => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPlan = planes.find((p: PlanTratamiento) => p.id === selectedPlanId);

  const calculateProgress = (plan: PlanTratamiento) => {
    if (!plan.items || plan.items.length === 0) return 0;
    const completed = plan.items.filter(item => item.estado === 'realizado').length;
    return Math.round((completed / plan.items.length) * 100);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-heading font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            Progreso de Tratamientos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-2xl">
            Visualiza la evolución clínica de tus pacientes y gestiona los hitos de cada plan de tratamiento de forma independiente.
          </p>
        </motion.div>

        <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-medical">
          <div className="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Activos</p>
            <p className="text-xl font-bold text-blue-600">{activePlanes.length}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Promedio</p>
            <p className="text-xl font-bold text-emerald-500">
              {activePlanes.length > 0 
                ? Math.round(activePlanes.reduce((acc: number, p: PlanTratamiento) => acc + calculateProgress(p), 0) / activePlanes.length)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List Section */}
        <div className={cn("col-span-1 lg:col-span-12 transition-all duration-500 ease-in-out", selectedPlanId && "lg:col-span-5 hidden lg:block")}>
          <PremiumCard className="h-full flex flex-col p-0 border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
            <div className="p-6 border-b border-slate-100/50 dark:border-slate-800/50 flex items-center gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar plan o paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/50 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-blue-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all shadow-sm"
                />
              </div>
              <button className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-500 hover:text-blue-500 border border-slate-200/50 dark:border-slate-800/50 transition-all">
                <Filter size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-350px)] custom-scrollbar">
              <AnimatePresence mode='popLayout'>
                {filteredPlanes.length > 0 ? (
                  filteredPlanes.map((plan) => {
                    const progress = calculateProgress(plan);
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={cn(
                          "group p-6 cursor-pointer border-b border-slate-100/30 dark:border-slate-800/30 transition-all hover:bg-blue-50/30 dark:hover:bg-blue-500/5",
                          selectedPlanId === plan.id && "bg-blue-50/50 dark:bg-blue-500/10 border-l-4 border-l-blue-500"
                        )}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                              {plan.nombre}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                              <Stethoscope size={12} className="text-slate-400" />
                              Dr. {plan.profesional?.usuario.nombre} {plan.profesional?.usuario.apellido}
                            </p>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            progress === 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                          )}>
                            {progress}%
                          </div>
                        </div>

                        {/* Progress Bar Mini */}
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              progress === 100 ? "bg-emerald-500" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                            )}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock size={12} /> Actualizado {new Date(plan.updatedAt).toLocaleDateString()}
                          </span>
                          <span className={cn(
                            "text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all",
                            selectedPlanId === plan.id && "opacity-100 translate-x-0"
                          )}>
                            <ChevronRight size={18} />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="p-20 text-center text-slate-400">
                    <Activity size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-medium">No hay planes de tratamiento activos que coincidan.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </PremiumCard>
        </div>

        {/* Detail Section */}
        <AnimatePresence>
          {selectedPlanId && selectedPlan && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="col-span-1 lg:col-span-7"
            >
              <PremiumCard className="h-full flex flex-col p-0 border-none bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-medical">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <button 
                        onClick={() => setSelectedPlanId(null)}
                        className="lg:hidden text-blue-500 font-bold text-sm mb-4 flex items-center gap-1"
                      >
                        <ChevronRight size={16} className="rotate-180" /> Volver
                      </button>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{selectedPlan.nombre}</h2>
                      <div className="flex items-center gap-4 mt-2">
                         <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                           <Activity size={14} className="text-blue-500" />
                           {selectedPlan.items.length} Procedimientos
                         </span>
                         <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                           <TrendingUp size={14} className="text-emerald-500" />
                           {calculateProgress(selectedPlan)}% Completado
                         </span>
                      </div>
                    </div>
                  </div>

                  {/* Large Progress Indicator */}
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateProgress(selectedPlan)}%` }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-600 to-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-450px)] custom-scrollbar">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 py-2 border-b border-slate-50 dark:border-slate-800">Hoja de Ruta Clínica</h4>
                  
                  <TratamientoProgreso 
                    plan={selectedPlan} 
                    onUpdateEstado={(itemId: string, estado: string) => updateItemEstado({ itemId, estado })}
                  />
                </div>
              </PremiumCard>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedPlanId && filteredPlanes.length > 0 && (
          <div className="hidden lg:block lg:col-span-12 py-20 text-center">
            <div className="h-24 w-24 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-glass">
              <Stethoscope size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Detalle del Tratamiento</h3>
            <p className="text-slate-500 mt-2">Selecciona un plan de la lista para ver el desglose<br />clínico y gestionar su progreso.</p>
          </div>
        )}
      </div>
    </div>
  );
};
