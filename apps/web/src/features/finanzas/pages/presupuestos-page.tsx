import React, { useState } from 'react';
import { usePresupuestos, useFinanzasMutations } from '../hooks/use-presupuestos';
import { PresupuestoList } from '../components/presupuesto-list';
import { PresupuestoForm } from '../components/presupuesto-form';
import { PagoModal } from '../components/pago-modal';
import { Presupuesto } from '../types';

export const PresupuestosPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);
  const [showPagoModal, setShowPagoModal] = useState(false);

  const { data: presupuestos = [], isLoading } = usePresupuestos();
  const { createPresupuesto, registerPago } = useFinanzasMutations();

  const handleCreate = async (data: any) => {
    try {
      await createPresupuesto.mutateAsync(data);
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

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Presupuestos y Facturación</h1>
          <p className="text-muted">Gestión de planes de tratamiento, cobros y saldos por paciente.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <span>💰</span> Generar Presupuesto
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem', border: 'none', background: 'rgba(16,185,129,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Total Facturado</span>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>$1,240,000</p>
        </div>
        <div className="card" style={{ padding: '1rem', border: 'none', background: 'rgba(239,68,68,0.05)' }}>
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>Saldo Pendiente</span>
          <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)' }}>$450,000</p>
        </div>
      </div>

      <PresupuestoList 
        presupuestos={presupuestos} 
        isLoading={isLoading} 
        onSelect={(p) => {
          setSelectedPresupuesto(p);
          setShowPagoModal(true);
        }}
      />

      {showCreateModal && (
        <PresupuestoForm 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          loading={createPresupuesto.isPending}
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
    </div>
  );
};
