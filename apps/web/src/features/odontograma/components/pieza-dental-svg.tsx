import React from 'react';
import { etiquetaPieza } from '@/lib/dental-numbering';

interface PiezaDentalSvgProps {
  posicion: number;
  /** Sistema de la clínica (ajustes); por defecto FDI. */
  sistemaDental?: string;
  caras: {
    vestibular: string;
    lingual: string;
    oclusal: string;
    distal: string;
    mesial: string;
  };
  selected?: boolean;
  onClick?: () => void;
  onCaraClick?: (cara: string) => void;
}

export const PiezaDentalSvg: React.FC<PiezaDentalSvgProps> = ({
  posicion,
  sistemaDental,
  caras,
  selected,
  onClick,
  onCaraClick
}) => {
  // Fallback seguro si caras viene null/undefined de la API
  const c = caras ?? {
    vestibular: 'sano', lingual: 'sano', oclusal: 'sano', distal: 'sano', mesial: 'sano'
  };
  const getColor = (estado: string | undefined | null) => {
    switch (estado) {
      case 'caries': return '#FF0000';
      case 'restauracion': return '#0000FF';
      case 'temporal': return '#008000';
      case 'corona': return '#0000FF';
      case 'ausente': return '#cbd5e1';
      case 'sano':
      default: return '#f1f5f9';
    }
  };

  const handleCaraClick = (e: React.MouseEvent, cara: string) => {
    e.stopPropagation();
    if (onCaraClick) onCaraClick(cara);
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Pieza dental ${etiquetaPieza(posicion, sistemaDental)}${selected ? ', seleccionada' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        padding: '4px',
        borderRadius: '8px',
        border: selected ? '2px solid var(--brand-500, #6d7bff)' : '1px solid transparent',
        background: selected ? 'var(--sb-active-bg)' : 'transparent',
        cursor: 'pointer',
        transition: 'all .15s ease',
        minWidth: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontSize: etiquetaPieza(posicion, sistemaDental).length > 2 ? '0.5rem' : '0.6rem',
          fontWeight: 700,
          color: 'var(--sb-text-muted)',
          lineHeight: 1,
          textAlign: 'center',
          maxWidth: '42px',
        }}
      >
        {etiquetaPieza(posicion, sistemaDental)}
      </span>

      <svg 
        width="46" 
        height="46" 
        viewBox="0 0 60 60"
        role="img"
        aria-label={`Estado de caras de la pieza ${etiquetaPieza(posicion, sistemaDental)}`}
      >
        {/* Border / Outer Shape */}
        <rect x="5" y="5" width="50" height="50" fill="none" stroke="#ddd" strokeWidth="1" />

        {/* Caras */}
        {/* Vestibular (Arriba) */}
        <polygon
          points="5,5 55,5 45,15 15,15"
          fill={getColor(c.vestibular)}
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'vestibular')}
          className="cursor-pointer hover:brightness-90 transition-all"
        >
          <title>Cara Vestibular: {c.vestibular}</title>
        </polygon>
        {/* Lingual (Abajo) */}
        <polygon
          points="15,45 45,45 55,55 5,55"
          fill={getColor(c.lingual)}
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'lingual')}
          className="cursor-pointer hover:brightness-90 transition-all"
        >
          <title>Cara Lingual: {c.lingual}</title>
        </polygon>
        {/* Distal */}
        <polygon
          points="5,5 15,15 15,45 5,55"
          fill={getColor(c.distal)}
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'distal')}
          className="cursor-pointer hover:brightness-90 transition-all"
        >
          <title>Cara Distal: {c.distal}</title>
        </polygon>
        {/* Mesial */}
        <polygon
          points="45,15 55,5 55,55 45,45"
          fill={getColor(c.mesial)}
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'mesial')}
          className="cursor-pointer hover:brightness-90 transition-all"
        >
          <title>Cara Mesial: {c.mesial}</title>
        </polygon>
        {/* Oclusal (Centro) */}
        <rect
          x="15" y="15" width="30" height="30"
          fill={getColor(c.oclusal)}
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'oclusal')}
          className="cursor-pointer hover:brightness-90 transition-all"
        >
          <title>Cara Oclusal: {c.oclusal}</title>
        </rect>
      </svg>
    </div>
  );
};
