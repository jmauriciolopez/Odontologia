import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt, Loader2, TrendingUp } from 'lucide-react';

// Hooks
import { usePresupuestos, useFinanzasMutations } from '../hooks/use-presupuestos';

// Components
import { FinanzasPatientSummary } from './FinanzasPatientSummary';
import { PresupuestoList } from './presupuesto-list';
import { PresupuestoForm } from './presupuesto-form';
import { PagoModal } from './pago-modal';

// Types
import { Presupuesto } from '../types';

interface FinanzasTabContentProps {
  pacienteId: string;
  pacienteNombre?: string;
}

export const FinanzasTabContent: React.FC<FinanzasTabContentProps> = ({ pacienteId, pacienteNombre }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);
  const [showPagoModal, setShowPagoModal] = useState(false);

  const { data: presupuestos = [], isLoading } = usePresupuestos({ pacienteId });
  const { createPresupuesto, registerPago } = useFinanzasMutations();

  const handleCreate = async (data: any) => {
    try {
      await createPresupuesto.mutateAsync({ ...data, pacienteId });
      setShowCreateModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterPago = async (data: any) => {
    try {
      await registerPago.mutateAsync(data);
      setShowPagoModal(false);
      setSelectedPresupuesto(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate Aggregates
  const stats = (presupuestos || []).reduce((acc, p) => {
    const paid = (p.pagos || []).reduce((sum, pago) => sum + Number(pago.monto), 0);
    
    // Only 'iniciado' and further states generate debt
    const generatesDebt = p.estado !== 'pendiente';
    
    return {
      total: generatesDebt ? acc.total + Number(p.total) : acc.total,
      pagado: acc.pagado + paid,
    };
  }, { total: 0, pagado: 0 });

  const pendiente = stats.total - stats.pagado;

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-[10px] font-bold uppercase tracking-widest">Sincronizando Estado Financiero...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Header Summary */}
      <FinanzasPatientSummary 
        total={stats.total} 
        pagado={stats.pagado} 
        pendiente={pendiente} 
      />

      {/* 2. Actions & List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10">
                <Receipt size={18} />
             </div>
             <div>
                <h3 className="font-bold text-slate-900 dark:text-white tracking-tight">Presupuestos Clínicos</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Historial de Tratamientos y Cobros</p>
             </div>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95 text-xs"
          >
            <Plus size={16} />
            Generar Presupuesto
          </button>
        </div>

        {presupuestos.length > 0 ? (
          <div className="medical-card p-0 overflow-hidden bg-white/50 backdrop-blur-sm border-slate-100 shadow-sm transition-all hover:shadow-md">
            <PresupuestoList 
              presupuestos={presupuestos} 
              isLoading={isLoading} 
              onSelect={(p) => {
                setSelectedPresupuesto(p);
                setShowPagoModal(true);
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-2xl shadow-sm border border-slate-100 dark:border-slate-800">💰</div>
             <div className="space-y-1">
               <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Sin Movimientos</p>
               <p className="text-xs text-slate-400 max-w-[220px] font-medium leading-relaxed">
                 No se han emitido presupuestos para este paciente. Use el botón superior para crear uno nuevo.
               </p>
             </div>
          </div>
        )}
      </div>

      {/* 3. Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <PresupuestoForm 
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            loading={createPresupuesto.isPending}
            initialPacienteId={pacienteId}
            initialPacienteNombre={pacienteNombre}
          />
        )}

        {showPagoModal && selectedPresupuesto && (
          <PagoModal 
            presupuesto={selectedPresupuesto}
            onClose={() => {
              setShowPagoModal(false);
              setSelectedPresupuesto(null);
            }}
            onSubmit={handleRegisterPago}
            loading={registerPago.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
