import React, { useState } from 'react';
import { usePacientes, usePacienteMutations } from '../hooks/use-pacientes';
import { PacientesTable } from '../components/pacientes-table';
import { PacienteForm } from '../components/paciente-form';

export const PacientesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const { data: pacientes = [], isLoading } = usePacientes({ search: searchTerm });
  const { createPaciente } = usePacienteMutations();

  const handleCreate = async (data: any) => {
    try {
      await createPaciente.mutateAsync(data);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Gestión de Pacientes</h1>
          <p className="text-muted">Busque, edite y administre la base de pacientes de la clínica.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span>➕</span> Nuevo Paciente
        </button>
      </header>

      <div className="flex gap-4 items-center">
        <input 
          className="input" 
          placeholder="Buscar por nombre, documento o teléfono..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
        <span className="text-muted" style={{ fontSize: '0.875rem' }}>{pacientes.length} pacientes encontrados</span>
      </div>

      <PacientesTable pacientes={pacientes} isLoading={isLoading} />

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '1rem' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Registrar Nuevo Paciente</h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.25rem', padding: '0.25rem' }}
              >
                ✕
              </button>
            </div>
            <PacienteForm onSubmit={handleCreate} loading={createPaciente.isPending} />
          </div>
        </div>
      )}
    </div>
  );
};
