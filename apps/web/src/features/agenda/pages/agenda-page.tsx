import React, { useState } from 'react';
import { useTurnos, useTurnoMutations, useProfesionales } from '../hooks/use-turnos';
import { AgendaList } from '../components/agenda-list';
import { TurnoFormModal } from '../components/turno-form-modal';

export const AgendaPage: React.FC = () => {
  const [selectedFecha, setSelectedFecha] = useState(new Date().toISOString().split('T')[0]);
  const [profesionalId, setProfesionalId] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { data: turnos = [], isLoading } = useTurnos({ 
    fecha: selectedFecha,
    profesionalId: profesionalId || undefined
  });

  const { data: profesionales = [] } = useProfesionales();
  const { createTurno } = useTurnoMutations();

  const handleCreateTurno = async (data: any) => {
    try {
      await createTurno.mutateAsync(data);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Agenda de Consultorio</h1>
          <p className="text-muted">Gestione los turnos diarios y disponibilidad de los profesionales.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <span>➕</span> Nuevo Turno
        </button>
      </header>

      <div className="card flex items-center justify-between" style={{ padding: '1rem', border: 'none', background: 'var(--bg-app)' }}>
        <div className="flex gap-4 items-center">
          <input 
            type="date" 
            className="input" 
            value={selectedFecha} 
            onChange={(e) => setSelectedFecha(e.target.value)}
            style={{ width: '200px' }}
          />
          <select 
            className="input" 
            value={profesionalId} 
            onChange={(e) => setProfesionalId(e.target.value)}
            style={{ width: '250px' }}
          >
            <option value="">Todos los Profesionales</option>
            {profesionales.map((p: any) => (
              <option key={p.id} value={p.id}>{p.usuario?.nombre}</option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>
          {turnos.length} Turnos Programados
        </div>
      </div>

      <AgendaList turnos={turnos} isLoading={isLoading} />

      {showModal && (
        <TurnoFormModal 
          onClose={() => setShowModal(false)} 
          onSubmit={handleCreateTurno}
          loading={createTurno.isPending}
        />
      )}
    </div>
  );
};
