import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { FichaClinica } from './ficha-clinica.entity';

@Entity('mediciones_periodontales')
export class MedicionPeriodontal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => FichaClinica, (ficha) => ficha.medicionesPeriodontales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fichaId' })
  ficha!: FichaClinica;

  @Index()
  @Column()
  fichaId!: string;

  @Column()
  posicionDiente!: number; // 11-48

  // Vestibular (3 puntos)
  @Column({ type: 'int', default: 0 })
  profundidadVestibularDistal!: number;
  @Column({ type: 'int', default: 0 })
  profundidadVestibularMedio!: number;
  @Column({ type: 'int', default: 0 })
  profundidadVestibularMesial!: number;

  @Column({ type: 'int', default: 0 })
  recesionVestibularDistal!: number;
  @Column({ type: 'int', default: 0 })
  recesionVestibularMedio!: number;
  @Column({ type: 'int', default: 0 })
  recesionVestibularMesial!: number;

  // Lingual/Palatino (3 puntos)
  @Column({ type: 'int', default: 0 })
  profundidadLingualDistal!: number;
  @Column({ type: 'int', default: 0 })
  profundidadLingualMedio!: number;
  @Column({ type: 'int', default: 0 })
  profundidadLingualMesial!: number;

  @Column({ type: 'int', default: 0 })
  recesionLingualDistal!: number;
  @Column({ type: 'int', default: 0 })
  recesionLingualMedio!: number;
  @Column({ type: 'int', default: 0 })
  recesionLingualMesial!: number;

  // Otros parámetros
  @Column({ default: false })
  sangrado!: boolean;

  @Column({ default: false })
  placa!: boolean;

  @Column({ type: 'int', default: 0 }) // 0-3
  movilidad!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
