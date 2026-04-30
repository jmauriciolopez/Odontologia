import React, { useState } from 'react';
import { usePacientes, usePacienteMutations } from '../hooks/use-pacientes';
import { PacientesTable } from '../components/pacientes-table';
import { PacienteForm } from '../components/paciente-form';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  MagnifyingGlass, 
  Users 
} from '@phosphor-icons/react';
import { PremiumCard } from '@/components/ui/premium-card';

export const PacientesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = usePacientes({ query: searchTerm });
  const pacientes = data?.data || [];
  const meta = data?.meta;
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
          <h1 className="text-4xl font-black text-[var(--sb-text)] tracking-tight flex items-center gap-3">
             <Users className="text-blue-600" size={32} />
             Gestión de Pacientes
          </h1>
          <p className="text-slate-500 font-medium mt-1">Busque, administre y acceda a la historia clínica de sus pacientes.</p>
        </motion.div>

        <button
          className="flex items-center gap-2 btn-primary px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={20} weight="bold" />
          <span className="font-bold tracking-tight">Nuevo Paciente</span>
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] group-focus-within:text-blue-500 transition-colors" size={20} weight="bold" />
          <input
            className="input-premium py-3 pl-12 pr-4 rounded-2xl text-sm font-medium w-full shadow-sm"
            placeholder="Buscar por nombre, documento o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
          style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text-muted)' }}>
          {meta?.total || 0} Registros Encontrados
        </div>
      </div>

      <PremiumCard className="p-0 overflow-hidden border-none shadow-medical">
        <PacientesTable pacientes={pacientes} isLoading={isLoading} />
      </PremiumCard>

      <AnimatePresence>
        {showModal && (
          <PacienteForm
            onSubmit={handleCreate}
            onClose={() => setShowModal(false)}
            loading={createPaciente.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
