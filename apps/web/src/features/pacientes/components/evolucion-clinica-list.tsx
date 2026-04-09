import React, { useState } from 'react';
import { EvolucionClinica } from '../types';

interface EvolucionClinicaListProps {
  evoluciones?: EvolucionClinica[];
  onAdd: (descripcion: string) => void;
  loading?: boolean;
}

export const EvolucionClinicaList: React.FC<EvolucionClinicaListProps> = ({ evoluciones = [], onAdd, loading }) => {
  const [newEvolucion, setNewEvolucion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvolucion.trim()) {
      onAdd(newEvolucion);
      setNewEvolucion('');
    }
  };

  return (
    <div className="card">
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Evolución Clínica (Timeline)</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2" style={{ marginBottom: '2rem' }}>
        <textarea
          className="input"
          placeholder="Escriba la evolución de la consulta de hoy..."
          value={newEvolucion}
          onChange={(e) => setNewEvolucion(e.target.value)}
          rows={3}
          style={{ resize: 'none' }}
        />
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={loading || !newEvolucion.trim()} style={{ padding: '0.4rem 1rem' }}>
            {loading ? 'Guardando...' : 'Registrar Evolución'}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {evoluciones.length > 0 ? evoluciones.map((ev, index) => (
          <div key={ev.id} className="flex gap-4" style={{
            paddingBottom: '1rem',
            borderLeft: '2px solid var(--border)',
            paddingLeft: '1.5rem',
            position: 'relative',
            marginLeft: '0.5rem'
          }}>
            <div style={{
              position: 'absolute',
              left: '-9px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'var(--primary)',
              border: '4px solid var(--bg-surface)'
            }} />
            <div className="flex flex-col gap-1 w-100">
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
                  {new Date(ev.fecha || ev.fechaRegistro || ev.createdAt || '').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}># {evoluciones.length - index}</span>
              </div>
              <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{ev.descripcion}</p>
            </div>
          </div>
        )) : (
          <p className="text-muted" style={{ fontSize: '0.875rem', textAlign: 'center', padding: '2rem' }}>
            Aún no hay evoluciones registradas para este paciente.
          </p>
        )}
      </div>
    </div>
  );
};
