import React from 'react';
import { PiezaDental } from '../types';
import { PiezaDentalSvg } from './pieza-dental-svg';

interface OdontogramaViewProps {
  piezas: PiezaDental[];
  onPiezaSelect: (pieza: PiezaDental) => void;
  selectedPiezaId?: string;
  sistemaDental?: string;
}

export const OdontogramaView: React.FC<OdontogramaViewProps> = ({
  piezas,
  onPiezaSelect,
  selectedPiezaId,
  sistemaDental,
}) => {
  const q1 = piezas.filter(p => p.posicion >= 11 && p.posicion <= 18).sort((a, b) => b.posicion - a.posicion);
  const q2 = piezas.filter(p => p.posicion >= 21 && p.posicion <= 28).sort((a, b) => a.posicion - b.posicion);
  const q3 = piezas.filter(p => p.posicion >= 31 && p.posicion <= 38).sort((a, b) => a.posicion - b.posicion);
  const q4 = piezas.filter(p => p.posicion >= 41 && p.posicion <= 48).sort((a, b) => b.posicion - a.posicion);

  return (
    <div
      style={{
        padding: '1.5rem 1rem',
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--sb-border)',
        overflowX: 'auto',
      }}
    >
      {/* Upper Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {q1.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              sistemaDental={sistemaDental}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
              onCaraClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {q2.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              sistemaDental={sistemaDental}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
              onCaraClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
      </div>

      {/* Middle Line */}
      <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '4px 0' }} />

      {/* Lower Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '8px' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {q4.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              sistemaDental={sistemaDental}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
              onCaraClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {q3.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              sistemaDental={sistemaDental}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
              onCaraClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
