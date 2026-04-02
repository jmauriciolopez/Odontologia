import React, { useState } from 'react';
import { useTurnos, useProfesionales, useConsultorios } from '../hooks/use-turnos';
import { CalendarHeader } from '../components/CalendarHeader';
import { CalendarGrid } from '../components/CalendarGrid';
import { TurnoFormModal } from '../components/turno-form-modal';
import { Turno } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Filter, X, Search } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

export const AgendaPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('week');
  
  // Filtros
  const [profesionalId, setProfesionalId] = useState('');
  const [consultorioId, setConsultorioId] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal State
  const [modalState, setModalState] = useState<{
    show: boolean;
    turno?: Turno;
    initialDate?: Date;
  }>({ show: false });

  const { data: turnos = [], isLoading } = useTurnos({ 
    fecha: view === 'day' ? format(currentDate, 'yyyy-MM-dd') : undefined,
    profesionalId: profesionalId || undefined,
    // Add consultorioId once backend supports it in filtros
  });

  const { data: profesionales = [] } = useProfesionales();
  const { data: consultorios = [] } = useConsultorios();

  const handleTimeSlotClick = (date: Date) => {
    setModalState({ show: true, initialDate: date });
  };

  const handleTurnoClick = (turno: Turno) => {
    setModalState({ show: true, turno });
  };

  const selectedProfesional = profesionales.find(p => p.id === profesionalId);
  const selectedConsultorio = consultorios.find(c => c.id === consultorioId);

  return (
    <div className="flex flex-col h-full max-w-[1600px] mx-auto">
      {/* Header with Navigation */}
      <CalendarHeader 
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        view={view}
        onViewChange={setView}
        onNewTurno={() => setModalState({ show: true })}
        profesionalNombre={selectedProfesional ? `${selectedProfesional.usuario.nombre} ${selectedProfesional.usuario.apellido}` : undefined}
        consultorioNombre={selectedConsultorio?.nombre}
      />

      {/* Toolbar / Filters */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all",
              showFilters 
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25" 
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400"
            )}
          >
            <Filter size={16} />
            Filtros Avanzados
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <select 
                  value={profesionalId}
                  onChange={(e) => setProfesionalId(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-all min-w-[200px]"
                >
                  <option value="">Todos los Profesionales</option>
                  {profesionales.map(p => (
                    <option key={p.id} value={p.id}>{p.usuario.nombre} {p.usuario.apellido}</option>
                  ))}
                </select>

                <select 
                  value={consultorioId}
                  onChange={(e) => setConsultorioId(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 transition-all min-w-[200px]"
                >
                  <option value="">Todos los Consultorios</option>
                  {consultorios.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>

                {(profesionalId || consultorioId) && (
                  <button 
                    onClick={() => { setProfesionalId(''); setConsultorioId(''); }}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Limpiar filtros"
                  >
                    <X size={18} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          {isLoading ? 'Sincronizando...' : `${turnos.length} Turnos Cargados`}
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 relative min-h-0">
        <AnimatePresence mode="wait">
          {isLoading && turnos.length === 0 ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 rounded-3xl"
            >
              <div className="relative">
                 <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                 <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">
                Cargando agenda clínica...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <CalendarGrid 
                currentDate={currentDate}
                view={view}
                turnos={turnos}
                onTurnoClick={handleTurnoClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {modalState.show && (
          <TurnoFormModal 
            turno={modalState.turno}
            initialDate={modalState.initialDate}
            onClose={() => setModalState({ show: false })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
