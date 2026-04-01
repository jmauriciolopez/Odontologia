import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePacienteDetalle, useEvolucionMutations } from '../hooks/use-pacientes';
import { FichaClinicaCard } from '../components/ficha-clinica-card';
import { AntecedentesList } from '../components/antecedentes-list';
import { EvolucionClinicaList } from '../components/evolucion-clinica-list';

export const PacienteDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: paciente, isLoading, error } = usePacienteDetalle(id!);
  const { createEvolucion } = useEvolucionMutations();

  if (isLoading) return <div>Cargando detalle del paciente...</div>;
  if (error || !paciente) return <div className="card text-danger">Error: Paciente no encontrado.</div>;

  const handleAddEvolucion = (descripcion: string) => {
    if (paciente.ficha?.id) {
      createEvolucion.mutate({ fichaId: paciente.ficha.id, data: { descripcion } });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link to="/pacientes" style={{ fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-muted)' }}>⬅️</Link>
          <div className="flex flex-col">
            <h1 style={{ fontSize: '1.75rem' }}>{paciente.apellido}, {paciente.nombre}</h1>
            <div className="flex gap-3 text-muted" style={{ fontSize: '0.875rem' }}>
              <span>🪪 {paciente.documento}</span>
              <span>📞 {paciente.telefono}</span>
              <span>🎂 {new Date(paciente.fechaNacimiento).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" style={{ background: 'var(--secondary)' }}>✏️ Editar </button>
          <button className="btn-primary">🦷 Odontograma</button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        <div className="flex flex-col gap-6">
          <FichaClinicaCard ficha={paciente.ficha} />
          <AntecedentesList antecedentes={paciente.ficha?.antecedentes} />
          
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Adjuntos y Radiografías</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Ningún archivo subido aún.</p>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'transparent', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
              Subir Archivo
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <EvolucionClinicaList 
            evoluciones={paciente.ficha?.evoluciones} 
            onAdd={handleAddEvolucion} 
            loading={createEvolucion.isPending}
          />
        </div>
      </div>
    </div>
  );
};
