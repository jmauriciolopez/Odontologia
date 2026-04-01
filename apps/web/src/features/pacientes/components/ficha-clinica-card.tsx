import React from 'react';
import { FichaClinica } from '../types';

interface FichaClinicaCardProps {
  ficha?: FichaClinica;
}

export const FichaClinicaCard: React.FC<FichaClinicaCardProps> = ({ ficha }) => {
  if (!ficha) return <div className="card text-muted">No hay ficha clínica registrada.</div>;

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 style={{ fontSize: '1.25rem' }}>Ficha Clínica</h3>
        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--bg-app)', borderRadius: '1rem', color: 'var(--primary)', fontWeight: 600 }}>ID: {ficha.id.slice(0, 8)}</span>
      </div>

      <div className="flex flex-col gap-2">
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Motivo de Consulta</label>
        <p style={{ fontSize: '0.875rem' }}>{ficha.motivoConsulta || 'No especificado'}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Historia Personal</label>
        <p style={{ fontSize: '0.875rem' }}>{ficha.historiaPersonal || 'Sin registros previos'}</p>
      </div>
    </div>
  );
};
