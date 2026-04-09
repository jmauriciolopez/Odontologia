import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UserPlus,
  Plus,
  Calendar,
  User,
  CreditCard,
  Stethoscope,
  Command,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../features/pacientes/hooks/use-pacientes';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { data: pacientes = [] } = usePacientes({ query });

  const actions = [
    { id: 'new-patient', label: 'Nuevo Paciente', icon: <UserPlus size={16}/>, path: '/pacientes', color: 'blue' },
    { id: 'new-appt', label: 'Agendar Cita', icon: <Calendar size={16}/>, path: '/agenda', color: 'emerald' },
    { id: 'finances', label: 'Ver Finanzas', icon: <CreditCard size={16}/>, path: '/presupuestos', color: 'amber' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : null; // This is handled by parent, but good to know
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-[var(--sb-border)] overflow-hidden relative z-10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 p-5 border-b border-[var(--sb-border)]">
               <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Search size={20} />
               </div>
               <input
                 autoFocus
                 type="text"
                 placeholder="Escriba un paciente o acción (Ctrl+K)..."
                 className="flex-1 bg-transparent border-none outline-none text-base font-medium text-[var(--sb-text)] placeholder:text-slate-300"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
               />
               <button onClick={onClose} className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 rounded-lg h-6">Esc</button>
            </div>

            {/* Content Scroll Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
               {/* Quick Actions Section */}
               {!query && (
                 <div className="mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3">Comandos Rápidos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {actions.map((action) => (
                         <button
                           key={action.id}
                           onClick={() => handleSelect(action.path)}
                           className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20 group"
                         >
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                action.color === 'blue' ? "bg-blue-100 text-blue-600" :
                                action.color === 'emerald' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                            )}>
                               {action.icon}
                            </div>
                            <span className="text-[11px] font-bold text-[var(--sb-text)]">{action.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {/* Results Section */}
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-3">
                    {query ? 'Resultados de la búsqueda' : 'Pacientes Recientes'}
                  </h4>
                  <div className="space-y-1">
                     {(pacientes || []).slice(0, 8).map((p) => (
                       <button
                         key={p.id}
                         onClick={() => handleSelect(`/pacientes/${p.id}`)}
                         className="w-full flex items-center justify-between p-3 rounded-2xl hover:opacity-800/50 transition-all group"
                       >
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                {p.nombre[0]}{p.apellido[0]}
                             </div>
                             <div className="flex flex-col text-left">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{p.nombre} {p.apellido}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.documento}</span>
                             </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                       </button>
                     ))}
                  </div>

                  {query && pacientes.length === 0 && (
                     <div className="flex flex-col items-center justify-center py-12 gap-4 text-slate-400">
                        <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-200">
                           <Search size={32} />
                        </div>
                        <div className="text-center">
                           <p className="text-sm font-bold text-slate-600 dark:text-slate-300 tracking-tight">No se encontraron resultados</p>
                           <p className="text-xs">Intente con otro nombre o documento.</p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[var(--sb-active-bg)] flex items-center justify-between border-t border-[var(--sb-border)]/50">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="px-1.5 py-0.5 rounded border border-[var(--sb-border)] bg-white dark:bg-slate-800 text-[9px] font-black">↑↓</div>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Navegar</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="px-1.5 py-0.5 rounded border border-[var(--sb-border)] bg-white dark:bg-slate-800 text-[9px] font-black">ENTER</div>
                     <span className="text-[9px] font-bold text-slate-400 uppercase">Seleccionar</span>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-blue-500">
                  <Command size={10} />
                  <span className="text-[9px] font-black italic">OMNIBOX PRO</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
