import React from 'react';
import { Presupuesto } from '../types';

interface PresupuestoListProps {
  presupuestos: Presupuesto[];
  isLoading: boolean;
  onSelect: (p: Presupuesto) => void;
}

export const PresupuestoList: React.FC<PresupuestoListProps> = ({ presupuestos, isLoading, onSelect }) => {
  if (isLoading) return <div>Cargando presupuestos...</div>;

  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'pagado': return { background: 'rgba(16,185,129,0.1)', color: 'var(--success)' };
      case 'pagado_parcial': return { background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' };
      case 'rechazado': return { background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' };
      default: return { background: 'var(--bg-app)', color: 'var(--text-muted)' };
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>ID / Fecha</th>
            <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Paciente</th>
            <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total</th>
            <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Estado</th>
            <th style={{ padding: '1rem' }}></th>
          </tr>
        </thead>
        <tbody>
          {presupuestos.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem' }}>
                <div className="flex flex-col">
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>#{p.id.slice(0, 8)}</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(p.fechaEmision).toLocaleDateString()}</span>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                {p.paciente ? `${p.paciente.apellido}, ${p.paciente.nombre}` : 'Paciente #'+p.pacienteId.slice(0, 5)}
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 700 }}>
                ${p.total.toLocaleString()}
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.6rem', 
                  borderRadius: '1rem', 
                  fontWeight: 600,
                  ...getBadgeStyle(p.estado)
                }}>
                  {p.estado.replace('_', ' ').toUpperCase()}
                </span>
              </td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }} onClick={() => onSelect(p)}>
                  Gestionar
                </button>
              </td>
            </tr>
          ))}
          {presupuestos.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No hay presupuestos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
