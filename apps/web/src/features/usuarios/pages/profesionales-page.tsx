import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Stethoscope, 
  Award, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useProfesionales, useAdminMutations } from '../hooks/use-admin';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

export const ProfesionalesPage: React.FC = () => {
  const { data: profesionales = [], isLoading } = useProfesionales();
  const { deleteProfesional } = useAdminMutations();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Cuerpo Médico
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            Gestión de especialistas y disponibilidad clínica
          </p>
        </div>

        <div className="flex items-center gap-2">
           <div className="relative group">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Filtrar por especialidad..." 
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none w-64"
              />
           </div>
           <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              <MoreVertical size={20} />
           </button>
        </div>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {profesionales.map((p) => (
            <PremiumCard key={p.id} className="group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="p-6 flex items-center gap-6">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-blue-600 shadow-inner">
                  {p.usuario.nombre[0]}{p.usuario.apellido[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight truncate">
                      Dr. {p.usuario.nombre} {p.usuario.apellido}
                    </h3>
                    <div className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                      {p.especialidad || 'General'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Award size={14}/> MN: {p.matricula || '---'}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1.5"><Stethoscope size={14}/> Sede Principal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => deleteProfesional.mutate(p.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={20} />
                   </button>
                   <button className="p-3 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                     <ChevronRight size={24} />
                   </button>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>
      )}

      {profesionales.length === 0 && !isLoading && (
        <div className="medical-card p-20 text-center border-dashed border-slate-200">
           <Stethoscope size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">No hay profesionales registrados</p>
           <p className="text-slate-400 text-xs mt-2">Los usuarios con rol de Doctor aparecerán aquí proactivamente.</p>
        </div>
      )}
    </div>
  );
};
