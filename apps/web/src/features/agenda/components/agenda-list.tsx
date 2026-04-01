import React from 'react';
import { Turno } from '../types';

interface AgendaListProps {
  turnos: Turno[];
  isLoading: boolean;
}

export const AgendaList: React.FC<AgendaListProps> = ({ turnos, isLoading }) => {
  if (isLoading) return <div>Cargando agenda...</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'var(--success)';
      case 'cancelado': return 'var(--danger)';
      case 'ausente': return 'var(--warning)';
      case 'atendido': return 'var(--text-muted)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {turnos.length > 0 ? turnos.map((turno) => (
        <div key={turno.id} className="card flex items-center gap-4" style={{ padding: '1rem' }}>
          <div className="flex flex-col items-center justify-center" style={{ width: '80px', borderRight: '1px solid var(--border)', paddingRight: '1rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>
              {new Date(turno.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {Math.round((new Date(turno.fechaFin).getTime() - new Date(turno.fechaInicio).getTime()) / 60000)} min
            </span>
          </div>

          <div className="flex flex-col gap-1" style={{ flex: 1 }}>
            <div className="flex items-center gap-2">
              <span 
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(turno.estado) }} 
              />
              <span style={{ fontWeight: 600 }}>{turno.paciente?.apellido}, {turno.paciente?.nombre}</span>
              <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', background: 'var(--bg-app)', borderRadius: '1rem', color: 'var(--text-muted)' }}>
                {turno.estado.toUpperCase()}
              </span>
            </div>
            <div className="flex gap-3 text-muted" style={{ fontSize: '0.75rem' }}>
              <span>👨‍⚕️ {turno.profesional?.usuario?.nombre}</span>
              <span>🏥 {turno.consultorio?.nombre}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary" style={{ padding: '0.35rem 0.75rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
              Detalle
            </button>
          </div>
        </div>
      )) : (
        <div className="card text-muted" style={{ padding: '3rem', textAlign: 'center' }}>
          No hay turnos programados para los filtros seleccionados.
        </div>
      )}
    </div>
  );
};
