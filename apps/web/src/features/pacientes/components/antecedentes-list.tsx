import React from 'react';
import { Antecedente } from '../types';

interface AntecedentesListProps {
  antecedentes?: Antecedente[];
}

export const AntecedentesList: React.FC<AntecedentesListProps> = ({ antecedentes = [] }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Antecedentes</h3>
        <button className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>➕ Agregar</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {antecedentes.length > 0 ? antecedentes.map((ant) => (
          <div key={ant.id} style={{ 
            padding: '0.5rem 1rem', 
            background: 'var(--bg-app)', 
            borderRadius: '2rem', 
            border: '1px solid var(--border)',
            fontSize: '0.875rem'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{ant.tipo}: </span>
            {ant.descripcion}
          </div>
        )) : (
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>No se registraron antecedentes médicos relevantes.</p>
        )}
      </div>
    </div>
  );
};
