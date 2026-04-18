import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  Clock,
  Search,
  X,
  ChevronRight,
  Stethoscope,
  TrendingUp,
  Printer
} from 'lucide-react';
import { useTratamientos } from '../hooks/use-tratamientos';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';
import { PlanTratamiento } from '../types';
import { TratamientoProgreso } from '../components/TratamientoProgreso';
import { printPlanTratamiento } from '../../finanzas/components/PresupuestoPrint';

export const TratamientosPage: React.FC = () => {
  const { planes, isLoading, updateItemEstado } = useTratamientos(); // Global view (backend needs to support findAll or similar, for now we will adapt)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const activePlanes = planes.filter((p: PlanTratamiento) => p.estado !== 'cancelado');

  const filteredPlanes = React.useMemo(() => {
    if (!searchTerm.trim()) return activePlanes;
    const term = searchTerm.toLowerCase();
    return activePlanes.filter((p: PlanTratamiento) => {
      return (
        p.nombre?.toLowerCase().includes(term) ||
        `${p.profesional?.usuario?.nombre || ''} ${p.profesional?.usuario?.apellido || ''}`.toLowerCase().includes(term) ||
        `${p.paciente?.nombre || ''} ${p.paciente?.apellido || ''}`.toLowerCase().includes(term) ||
        p.items?.some(it => it.tipo?.toLowerCase().includes(term))
      );
    });
  }, [activePlanes, searchTerm]);

  const selectedPlan = planes.find((p: PlanTratamiento) => p.id === selectedPlanId)
    ?? filteredPlanes.find((p: PlanTratamiento) => p.id === selectedPlanId);

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
          <h1 className="text-4xl font-heading font-bold tracking-tight text-[var(--sb-text)] flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            Progreso de Tratamientos
          </h1>
          <p className="text-[var(--sb-text-muted)] mt-2 font-medium max-w-2xl">
            Visualiza la evolución clínica de tus pacientes y gestiona los hitos de cada plan de tratamiento de forma independiente.
          </p>
        </motion.div>

        <div className="flex items-center gap-4 p-2 rounded-2xl border border-[var(--sb-border)] shadow-medical"
          style={{ background: 'var(--card-bg)' }}>
          <div className="px-4 py-2 text-center border-r border-[var(--sb-border)]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Activos</p>
            <p className="text-xl font-bold text-blue-600">{activePlanes.length}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">Promedio</p>
            <p className="text-xl font-bold text-emerald-500">
              {activePlanes.length > 0
                ? Math.round(activePlanes.reduce((acc: number, p: PlanTratamiento) => acc + calculateProgress(p), 0) / activePlanes.length)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List — se oculta en cualquier tamaño cuando hay detalle abierto */}
        <div className={cn(
          "lg:col-span-5 transition-all",
          selectedPlanId ? "hidden lg:block" : "col-span-1 lg:col-span-12"
        )}>
          <PremiumCard className="h-full flex flex-col p-0 border-none">
            <div className="p-6 border-b border-[var(--sb-border)] flex items-center gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por plan, paciente o profesional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-premium py-2.5 pl-10 pr-10 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sb-border)] hover:text-slate-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
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
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-[var(--sb-text)] group-hover:text-blue-600 transition-colors leading-none">
                              {plan.nombre}
                            </h3>
                            <p className="text-xs font-bold text-[var(--sb-text-muted)]">
                              🛒 {plan.paciente?.nombre} {plan.paciente?.apellido}
                            </p>
                            <p className="text-[11px] font-medium text-[var(--sb-text-muted)] flex items-center gap-1.5 pt-1">
                              <Stethoscope size={12} className="text-slate-300" />
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

                        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--sb-active-bg)' }}>
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
                          <span className="text-[11px] text-[var(--sb-text-muted)] flex items-center gap-1">
                            <Clock size={12} /> Actualizado {new Date(plan.updatedAt).toLocaleDateString()}
                          </span>
                          <ChevronRight size={18} className={cn(
                            "text-blue-500 opacity-0 group-hover:opacity-100 transition-all",
                            selectedPlanId === plan.id && "opacity-100"
                          )} />
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="medical-card p-20 text-center mx-6 my-10 border-dashed border-[var(--sb-border)] shadow-none">
                    <Activity size={48} className="mx-auto text-[var(--sb-border)] dark:text-slate-800 mb-4" />
                    <p className="text-[var(--sb-text-muted)] font-bold uppercase tracking-widest text-[11px]">No se encontraron planes</p>
                    <p className="text-[var(--sb-text-muted)] text-xs mt-2">Intenta con otro término de búsqueda.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </PremiumCard>
        </div>

        {/* Detail panel — visible en cualquier tamaño cuando hay selección */}
        {selectedPlan ? (
          <motion.div
            key={selectedPlan.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="col-span-1 lg:col-span-7"
          >
            <PremiumCard className="h-full flex flex-col p-0 border-none shadow-medical">
              <div className="p-8 border-b border-[var(--sb-border)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <button
                      onClick={() => setSelectedPlanId(null)}
                      className="text-blue-500 font-bold text-sm mb-4 flex items-center gap-1"
                    >
                      <ChevronRight size={16} className="rotate-180" /> Volver a la lista
                    </button>
                    <h2 className="text-2xl font-bold text-[var(--sb-text)] uppercase tracking-tight">{selectedPlan.nombre}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm font-medium text-[var(--sb-text-muted)] flex items-center gap-1.5">
                        <Activity size={14} className="text-blue-500" />
                        {selectedPlan.items.length} Procedimientos
                      </span>
                      <span className="text-sm font-medium text-[var(--sb-text-muted)] flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-emerald-500" />
                        {calculateProgress(selectedPlan)}% Completado
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => printPlanTratamiento(selectedPlan)}
                    title="Imprimir / Guardar PDF"
                    className="flex items-center gap-2 border border-[var(--sb-border)] hover:border-slate-400 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:text-slate-600 shrink-0"
                    style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text-muted)' }}
                  >
                    <Printer size={14} />
                    Imprimir
                  </button>
                </div>

                <div className="overflow-hidden h-3 rounded-full" style={{ background: 'var(--sb-active-bg)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress(selectedPlan)}%` }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                  />
                </div>
              </div>

              <div className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-450px)] custom-scrollbar">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--sb-text-muted)] mb-6 py-2 border-b border-slate-50 dark:border-slate-800">
                  Hoja de Ruta Clínica
                </h4>
                <TratamientoProgreso
                  plan={selectedPlan}
                  onUpdateEstado={(itemId: string, estado: string) => updateItemEstado({ itemId, estado })}
                />
              </div>
            </PremiumCard>
          </motion.div>
        ) : (
          filteredPlanes.length > 0 && (
            <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center py-20 text-center">
              <div className="h-24 w-24 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-500">
                <Stethoscope size={40} />
              </div>
              <h3 className="text-xl font-bold text-[var(--sb-text)] uppercase tracking-tight">Detalle del Tratamiento</h3>
              <p className="text-slate-500 mt-2">Seleccioná un plan de la lista para ver el desglose clínico.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
