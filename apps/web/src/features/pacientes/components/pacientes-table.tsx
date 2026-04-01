import React from 'react';
import { Paciente } from '../types';
import { useNavigate } from 'react-router-dom';

interface PacientesTableProps {
  pacientes: Paciente[];
  isLoading: boolean;
}

export const PacientesTable: React.FC<PacientesTableProps> = ({ pacientes, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) return <div>Cargando tabla...</div>;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border)' }}>
          <tr>
            <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Paciente</th>
            <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Documento</th>
            <th style={{ padding: '1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Teléfono</th>
            <th style={{ padding: '1rem' }}></th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr 
              key={paciente.id} 
              onClick={() => navigate(`/pacientes/${paciente.id}`)}
              style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '1rem' }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                    {paciente.nombre.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{paciente.apellido}, {paciente.nombre}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{paciente.email || 'Sin email'}</span>
                  </div>
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{paciente.documento}</td>
              <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{paciente.telefono}</td>
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button 
                  className="btn-primary" 
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pacientes/${paciente.id}`);
                  }}
                >
                  Ver Ficha
                </button>
              </td>
            </tr>
          ))}
          {pacientes.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No se encontraron pacientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
