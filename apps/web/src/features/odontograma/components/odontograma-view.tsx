import React from 'react';
import { PiezaDental } from '../types';
import { PiezaDentalSvg } from './pieza-dental-svg';

interface OdontogramaViewProps {
  piezas: PiezaDental[];
  onPiezaSelect: (pieza: PiezaDental) => void;
  selectedPiezaId?: string;
}

export const OdontogramaView: React.FC<OdontogramaViewProps> = ({
  piezas,
  onPiezaSelect,
  selectedPiezaId
}) => {
  // Cuadrantes 1, 2 (Superiores) y 4, 3 (Inferiores)
  const q1 = piezas.filter(p => p.posicion >= 11 && p.posicion <= 18).sort((a,b) => b.posicion - a.posicion);
  const q2 = piezas.filter(p => p.posicion >= 21 && p.posicion <= 28).sort((a,b) => a.posicion - b.posicion);
  const q3 = piezas.filter(p => p.posicion >= 31 && p.posicion <= 38).sort((a,b) => a.posicion - b.posicion);
  const q4 = piezas.filter(p => p.posicion >= 41 && p.posicion <= 48).sort((a,b) => b.posicion - a.posicion);

  return (
    <div className="flex flex-col gap-8 items-center"
      style={{
        padding: '2rem',
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--sb-border)',
      }}
    >
      {/* Upper Row */}
      <div className="flex gap-16">
        <div className="flex gap-2">
          {q1.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
              onCaraClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {q2.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
              onCaraClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
      </div>

      {/* Middle Line (separator) */}
      <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

      {/* Lower Row */}
      <div className="flex gap-16">
        <div className="flex gap-2">
          {q4.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
              onCaraClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {q3.map(p => (
            <PiezaDentalSvg
              key={p.id}
              posicion={p.posicion}
              caras={p.caras}
              selected={p.id === selectedPiezaId}
              onClick={() => onPiezaSelect(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
