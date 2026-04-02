import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OdontogramaManager } from '../components/OdontogramaManager';
import { ChevronLeft, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

export const OdontogramaPage: React.FC = () => {
  const { id, fichaId } = useParams<{ id: string, fichaId: string }>();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 min-h-screen"
    >
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/pacientes/${id}`)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
            title="Volver a la ficha del paciente"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Odontograma Externo</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
               <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded leading-none text-[10px] border border-slate-200 dark:border-slate-700">FICHA ID: {fichaId?.slice(0, 8)}...</span>
               <span className="h-1 w-1 rounded-full bg-slate-300" />
               <span className="flex items-center gap-1 font-bold text-primary/80 uppercase tracking-tighter text-[11px]"><Stethoscope size={12} /> Modo Edición Clínica Full</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
           <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
           <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Historial Clínico Sincronizado</span>
        </div>
      </header>

      {/* Reusable Manager Component */}
      <div className="flex-1">
        <OdontogramaManager fichaId={fichaId!} />
      </div>
    </motion.div>
  );
};
