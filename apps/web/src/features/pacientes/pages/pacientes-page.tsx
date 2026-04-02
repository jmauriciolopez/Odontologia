import React, { useState } from 'react';
import { usePacientes, usePacienteMutations } from '../hooks/use-pacientes';
import { PacientesTable } from '../components/pacientes-table';
import { PacienteForm } from '../components/paciente-form';

import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Users, Stethoscope, FileText, ChevronRight } from 'lucide-react';
import { PremiumCard } from '@/components/ui/premium-card';

export const PacientesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const { data: pacientes = [], isLoading } = usePacientes({ query: searchTerm });
  const { createPaciente } = usePacienteMutations();

  const handleCreate = async (data: any) => {
    try {
      await createPaciente.mutateAsync(data);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
             <Users className="text-blue-600" size={32} />
             Gestión de Pacientes
          </h1>
          <p className="text-slate-500 font-medium mt-1">Busque, administre y acceda a la historia clínica de sus pacientes.</p>
        </motion.div>
        
        <button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={20} />
          <span>Nuevo Paciente</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-blue-500/20 py-3 pl-12 pr-4 rounded-2xl outline-none shadow-sm text-sm font-medium transition-all" 
            placeholder="Buscar por nombre, documento o teléfono..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
          {pacientes.length} Registros Encontrados
        </div>
      </div>

      <PremiumCard className="p-0 overflow-hidden border-none shadow-medical">
        <PacientesTable pacientes={pacientes} isLoading={isLoading} />
      </PremiumCard>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Afiliar Nuevo Paciente</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-8">
                <PacienteForm onSubmit={handleCreate} loading={createPaciente.isPending} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
