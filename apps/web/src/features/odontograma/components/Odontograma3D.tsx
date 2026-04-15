import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { Tooth3D } from './Tooth3D';
import { PiezaDental } from '../types';

interface Odontograma3DProps {
  piezas: PiezaDental[];
  onPiezaSelect?: (pieza: PiezaDental) => void;
  selectedPiezaId?: string;
  sistemaDental?: string;
}

export const Odontograma3D: React.FC<Odontograma3DProps> = ({
  piezas,
  onPiezaSelect,
  selectedPiezaId,
  sistemaDental,
}) => {
  const superior = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const inferior = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <div className="h-[600px] w-full bg-[var(--card-bg)] rounded-[3rem] overflow-hidden border border-[var(--sb-border)] shadow-inner group">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={35} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} />

        <Suspense fallback={null}>
          <group position={[0, 2, 0]}>
            {superior.map((p, i) => {
              const pieza = piezas.find(pz => pz.posicion === p) || { posicion: p, caras: {} } as PiezaDental;
              return (
                <Tooth3D
                  key={p}
                  posicion={p}
                  sistemaDental={sistemaDental}
                  caras={pieza.caras}
                  position={[(i - 7.5) * 1.5, 0, 0]}
                  isSelected={pieza.id === selectedPiezaId}
                  onSelect={() => onPiezaSelect?.(pieza)}
                />
              );
            })}
          </group>

          <group position={[0, -2, 0]}>
            {inferior.map((p, i) => {
              const pieza = piezas.find(pz => pz.posicion === p) || { posicion: p, caras: {} } as PiezaDental;
              return (
                <Tooth3D
                  key={p}
                  posicion={p}
                  sistemaDental={sistemaDental}
                  caras={pieza.caras}
                  position={[(i - 7.5) * 1.5, 0, 0]}
                  isSelected={pieza.id === selectedPiezaId}
                  onSelect={() => onPiezaSelect?.(pieza)}
                />
              );
            })}
          </group>

          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.15} far={10} color="#000000" />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 p-4 bg-[var(--card-bg)] backdrop-blur-md rounded-2xl border border-[var(--sb-border)] flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Click para seleccionar · Scroll para zoom</p>
      </div>
    </div>
  );
};
