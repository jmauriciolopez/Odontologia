import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { etiquetaPieza } from '@/lib/dental-numbering';

interface Tooth3DProps {
  posicion: number;
  sistemaDental?: string;
  caras: {
    vestibular?: string;
    lingual?: string;
    oclusal?: string;
    distal?: string;
    mesial?: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
  position: [number, number, number];
}

export const Tooth3D: React.FC<Tooth3DProps> = ({ 
  posicion,
  sistemaDental,
  caras, 
  isSelected, 
  onSelect,
  position 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const getFaceColor = (estado?: string) => {
    switch (estado) {
      case 'caries': return '#FF0000';
      case 'restauracion': return '#0000FF';
      case 'temporal': return '#008000';
      case 'corona': return '#0000FF';
      case 'ausente': return 'transparent';
      default: return '#ffffff';
    }
  };

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onSelect?.(); }}>
      {/* Main Tooth Body */}
      <RoundedBox 
        args={[1, 1.2, 1]} 
        radius={0.2} 
        smoothness={4}
        ref={meshRef}
      >
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : '#f8fafc'} 
          transparent={caras.vestibular === 'ausente'}
          opacity={caras.vestibular === 'ausente' ? 0.1 : 1}
        />
      </RoundedBox>

      {/* Face Overlays (Simplified markers) */}
      {['vestibular', 'lingual', 'oclusal', 'distal', 'mesial'].map((cara, idx) => {
        const estado = (caras as any)[cara];
        if (!estado || estado === 'sano') return null;

        return (
          <mesh key={cara} position={[0, 0, 0.51]} scale={0.4}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color={getFaceColor(estado)} />
          </mesh>
        );
      })}

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {etiquetaPieza(posicion, sistemaDental)}
      </Text>
    </group>
  );
};
