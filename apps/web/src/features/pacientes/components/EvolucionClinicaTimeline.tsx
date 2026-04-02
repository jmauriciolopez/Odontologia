import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EvolucionClinica } from '../types';
import { 
  Plus, 
  History, 
  Clock, 
  User, 
  MessageSquare, 
  Stethoscope, 
  ShieldAlert, 
  Sparkles,
  Scissors,
  FileText,
  ChevronDown,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface EvolucionClinicaTimelineProps {
  evoluciones?: EvolucionClinica[];
  onAdd: (descripcion: string, categoria?: string) => void;
  loading?: boolean;
}

const CATEGORIES = [
  { id: 'General', label: 'General', icon: <Stethoscope size={14} />, color: 'blue' },
  { id: 'Cirugía', label: 'Cirugía', icon: <Scissors size={14} />, color: 'rose' },
  { id: 'Estética', label: 'Estética', icon: <Sparkles size={14} />, color: 'amber' },
  { id: 'Urgencia', label: 'Urgencia', icon: <ShieldAlert size={14} />, color: 'red' },
];

const TEMPLATES = [
  { 
    name: 'Examen Inicial', 
    text: 'Paciente acude a consulta por valoración. Se realiza examen clínico y radiográfico. Se observa buen estado general. Plan de tratamiento sugerido: ...' 
  },
  { 
    name: 'Limpieza/Profilaxis', 
    text: 'Se realiza detartraje supragingival y profilaxis con pasta abrasiva. Se eliminan cálculos y manchas extrínsecas. Instrucciones de higiene oral brindadas.' 
  },
  { 
    name: 'Restauración Resina', 
    text: 'Aislamiento del campo operatorio. Limpieza de cavidad y eliminación de tejido cariado. Grabado ácido, adhesivo y obturación con resina compuesta. Ajuste oclusal y pulido.' 
  },
  { 
    name: 'Exodoncia Simple', 
    text: 'Anestesia infiltrativa local. Sindesmotomía, luxación y exodoncia del elemento (...). Toilette de la cavidad. Hemostasia lograda. Indicaciones post-operatorias entregadas.' 
  },
];

export const EvolucionClinicaTimeline: React.FC<EvolucionClinicaTimelineProps> = ({ evoluciones = [], onAdd, loading }) => {
  const [newEvolucion, setNewEvolucion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [isExpanding, setIsExpanding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvolucion.trim()) {
      onAdd(newEvolucion, selectedCategory);
      setNewEvolucion('');
      setIsExpanding(false);
    }
  };

  const applyTemplate = (text: string) => {
    setNewEvolucion(text);
    setShowTemplates(false);
    setIsExpanding(true);
  };

  const getCategoryColor = (cat?: string) => {
    const c = CATEGORIES.find(c => c.id === cat) || CATEGORIES[0];
    switch (c.color) {
      case 'rose': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'amber': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'red': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default: return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      {/* 1. New Evolution Input Card */}
      <motion.div 
        layout
        className="medical-card p-0 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 relative overflow-visible"
      >
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/10">
                        <Plus size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">Registro de Evolución</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inscripción Profesional en Historia Clínica</p>
                    </div>
                </div>

                <div className="relative">
                    <button 
                        type="button"
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all border border-slate-200 dark:border-slate-700"
                    >
                        <FileText size={14} />
                        Usar Plantilla
                        <ChevronDown size={12} className={cn("transition-transform", showTemplates && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                        {showTemplates && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                            >
                                <div className="p-2">
                                    {TEMPLATES.map((t) => (
                                        <button 
                                            key={t.name}
                                            onClick={() => applyTemplate(t.text)}
                                            className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-xs font-bold text-slate-700 dark:text-slate-200 flex flex-col gap-1"
                                        >
                                            {t.name}
                                            <span className="text-[10px] font-medium text-slate-400 truncate line-clamp-1">{t.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category selector */}
              <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border-2",
                            selectedCategory === cat.id 
                                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10" 
                                : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        )}
                      >
                        {cat.icon}
                        {cat.label}
                      </button>
                  ))}
              </div>

              <textarea
                className="w-full px-6 py-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border-2 border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm font-medium text-slate-900 dark:text-white outline-none resize-none min-h-[140px] placeholder:text-slate-300"
                placeholder="Describa detalladamente el procedimiento..."
                value={newEvolucion}
                onChange={(e) => setNewEvolucion(e.target.value)}
                onFocus={() => setIsExpanding(true)}
              />
              
              <AnimatePresence>
                {(isExpanding || newEvolucion.trim().length > 0) && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-6 px-1"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600/60 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/5 px-3 py-1.5 rounded-lg">
                      <Info size={12} />
                      Este registro es inalterable una vez firmado
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                       <button 
                        type="button"
                        onClick={() => {setNewEvolucion(''); setIsExpanding(false);}}
                        className="flex-1 sm:flex-none px-6 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl shadow-xl shadow-blue-500/25 transition-all active:scale-95 text-xs" 
                        disabled={loading || !newEvolucion.trim()}
                      >
                        {loading ? 'Procesando...' : 'Firmar y Registrar'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
        </div>
      </motion.div>

      {/* 2. Timeline List */}
      <div className="relative space-y-10 pl-10 before:absolute before:left-[13px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-slate-200/50 before:via-blue-200/30 before:to-transparent dark:before:from-slate-800/50">
        {evoluciones.length > 0 ? (
          evoluciones.map((ev, index) => (
            <motion.div 
              key={ev.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Timeline Indicator */}
              <div className="absolute -left-[45px] top-4 h-10 w-10 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm z-10 transition-all group-hover:border-blue-500/20">
                  <div className={cn(
                    "h-3 w-3 rounded-full shadow-lg",
                    getCategoryColor(ev.categoria).split(' ')[0]
                  )} />
              </div>
              
              <div className="medical-card p-6 bg-white/50 backdrop-blur-md border-slate-100 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm hover:shadow-2xl hover:shadow-slate-200/20 dark:hover:shadow-black/20 group">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter flex items-center gap-2">
                           {format(new Date(ev.fechaRegistro), "d 'de' MMMM, yyyy", { locale: es })}
                           <span className="text-slate-300 font-medium">|</span>
                           <span className="text-blue-500">{format(new Date(ev.fechaRegistro), "HH:mm")}</span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Registro Clínico #{evoluciones.length - index}</span>
                      </div>
                    </div>
                    
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border self-start sm:self-center",
                        getCategoryColor(ev.categoria)
                    )}>
                        {ev.categoria || 'General'}
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 bottom-1 w-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-2">
                      {ev.descripcion}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/40">
                    <div className="flex items-center gap-2 group/author cursor-default">
                      <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <User size={12} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover/author:text-slate-600 transition-colors uppercase tracking-widest">Dr. Responsable Clínica</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                      <MessageSquare size={12} />
                      <span>Validado</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-28 px-6 text-center gap-6 bg-slate-50/30 dark:bg-slate-800/10 rounded-[4rem] border-4 border-dotted border-slate-100 dark:border-slate-800">
             <div className="h-24 w-24 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-xl border border-slate-50 dark:border-slate-800 rotate-6 transition-transform hover:rotate-12 cursor-default">✨</div>
             <div className="space-y-2">
               <p className="font-black text-xl text-slate-800 dark:text-slate-200 tracking-tight">Comience la Historia Clínica</p>
               <p className="text-xs text-slate-400 max-w-[280px] font-bold uppercase tracking-widest leading-loose italic underline-offset-4 decoration-blue-500/20">
                 Haga click arriba para registrar el primer paso de este viaje clínico.
               </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
