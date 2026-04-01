import React from 'react';

interface PiezaDentalSvgProps {
  posicion: number;
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
  caras, 
  selected, 
  onClick,
  onCaraClick 
}) => {
  const getColor = (estado: string) => {
    switch (estado) {
      case 'caries': return '#ef4444';
      case 'restauracion': return '#10b981';
      case 'ausente': return '#cbd5e1';
      case 'corona': return '#f59e0b';
      default: return '#ffffff';
    }
  };

  const handleCaraClick = (e: React.MouseEvent, cara: string) => {
    e.stopPropagation();
    if (onCaraClick) onCaraClick(cara);
  };

  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '4px',
        padding: '8px',
        borderRadius: 'var(--radius)',
        border: selected ? '2px solid var(--primary)' : '1px solid transparent',
        background: selected ? 'var(--bg-app)' : 'transparent',
        cursor: 'pointer'
      }}
    >
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{posicion}</span>
      
      <svg width="60" height="60" viewBox="0 0 60 60">
        {/* Border / Outer Shape */}
        <rect x="5" y="5" width="50" height="50" fill="none" stroke="#ddd" strokeWidth="1" />
        
        {/* Caras */}
        {/* Vestibular (Arriba) */}
        <polygon 
          points="5,5 55,5 45,15 15,15" 
          fill={getColor(caras.vestibular)} 
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'vestibular')}
        />
        {/* Lingual (Abajo) */}
        <polygon 
          points="15,45 45,45 55,55 5,55" 
          fill={getColor(caras.lingual)} 
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'lingual')}
        />
        {/* Distal (Izquierda o Derecha según cuadrante, simplificamos a L/R visual) */}
        <polygon 
          points="5,5 15,15 15,45 5,55" 
          fill={getColor(caras.distal)} 
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'distal')}
        />
        {/* Mesial */}
        <polygon 
          points="45,15 55,5 55,55 45,45" 
          fill={getColor(caras.mesial)} 
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'mesial')}
        />
        {/* Oclusal (Centro) */}
        <rect 
          x="15" y="15" width="30" height="30" 
          fill={getColor(caras.oclusal)} 
          stroke="#666" strokeWidth="0.5"
          onClick={(e) => handleCaraClick(e, 'oclusal')}
        />
      </svg>
    </div>
  );
};
