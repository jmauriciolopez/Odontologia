import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOdontograma, useOdontogramaMutations } from '../hooks/use-odontograma';
import { OdontogramaView } from '../components/odontograma-view';
import { PiezaDental } from '../types';

export const OdontogramaPage: React.FC = () => {
  const { fichaId } = useParams<{ fichaId: string }>();
  const { data: piezas = [], isLoading } = useOdontograma(fichaId!);
  const { updatePieza, addProcedimiento } = useOdontogramaMutations(fichaId!);
  const [selectedPieza, setSelectedPieza] = useState<PiezaDental | null>(null);

  if (isLoading) return <div>Cargando odontograma...</div>;

  const handleUpdateCara = async (cara: string, estado: string) => {
    if (selectedPieza) {
      await updatePieza.mutateAsync({
        piezaId: selectedPieza.id,
        caras: { [cara]: estado }
      });
      // Update local state if needed (react-query handles refetch)
    }
  };

  const states = [
    { id: 'sano', label: 'Sano', color: '#fff' },
    { id: 'caries', label: 'Caries', color: '#ef4444' },
    { id: 'restauracion', label: 'Restauración', color: '#10b981' },
    { id: 'ausente', label: 'Ausente', color: '#cbd5e1' },
    { id: 'corona', label: 'Corona', color: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to={`/pacientes`} style={{ fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-muted)' }}>⬅️</Link>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>Odontograma Interactivo</h1>
            <p className="text-muted">Ficha Clínica ID: {fichaId?.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex gap-4">
          {states.map(s => (
            <div key={s.id} className="flex items-center gap-2">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.color, border: '1px solid #ddd' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        <OdontogramaView 
          piezas={piezas} 
          onPiezaSelect={setSelectedPieza} 
          selectedPiezaId={selectedPieza?.id} 
        />

        <div className="card flex flex-col gap-4">
          {selectedPieza ? (
            <>
              <h3 style={{ fontSize: '1.25rem' }}>Pieza {selectedPieza.posicion}</h3>
              <div className="flex flex-col gap-3">
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Actualizar Cara:</p>
                {['vestibular', 'lingual', 'oclusal', 'distal', 'mesial'].map(cara => (
                  <div key={cara} className="flex flex-col gap-1">
                    <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{cara}</span>
                    <select 
                      className="input" 
                      value={(selectedPieza.caras as any)[cara]}
                      onChange={(e) => handleUpdateCara(cara, e.target.value)}
                    >
                      {states.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Procedimientos:</p>
                {selectedPieza.procedimientos?.length ? selectedPieza.procedimientos.map(proc => (
                  <div key={proc.id} style={{ fontSize: '0.75rem', padding: '0.5rem', background: 'var(--bg-app)', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{proc.tipo}</span> - {new Date(proc.fechaRealizacion).toLocaleDateString()}
                  </div>
                )) : <p className="text-muted" style={{ fontSize: '0.75rem' }}>Sin procedimientos registrados.</p>}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted">
              <span>🦷</span>
              <p style={{ fontSize: '0.875rem' }}>Seleccione una pieza dental para ver detalles y editar estados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
