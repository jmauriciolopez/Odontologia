import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt, Loader2, TrendingUp } from 'lucide-react';

// Hooks
import { usePacienteFinanzas, useFinanzasMutations } from '../hooks/use-presupuestos';

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

  const { data: presupuestos = [], isLoading } = usePacienteFinanzas(pacienteId);
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
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-[var(--sb-text-muted)]">
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
             <div className="p-2 rounded-xl shadow-lg" style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text)' }}>
                <Receipt size={18} />
             </div>
             <div>
                <h3 className="font-bold text-[var(--sb-text)] tracking-tight">Presupuestos Clínicos</h3>
                <p className="text-[10px] font-bold text-[var(--sb-text-muted)] uppercase tracking-widest">Historial de Tratamientos y Cobros</p>
             </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-xs"
          >
            <Plus size={16} />
            Generar Presupuesto
          </button>
        </div>

        {presupuestos.length > 0 ? (
          <div className="medical-card p-0 overflow-hidden transition-all hover:shadow-md">
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
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center gap-4 rounded-[3rem] border-2 border-dashed border-[var(--sb-border)]">
             <div className="h-16 w-16 rounded-full flex items-center justify-center text-2xl shadow-sm border border-[var(--sb-border)]"
               style={{ background: 'var(--card-bg)' }}>💰</div>
             <div className="space-y-1">
               <p className="font-bold uppercase tracking-tight" style={{ color: 'var(--sb-text)' }}>Sin Movimientos</p>
               <p className="text-xs max-w-[220px] font-medium leading-relaxed" style={{ color: 'var(--sb-text-muted)' }}>
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
