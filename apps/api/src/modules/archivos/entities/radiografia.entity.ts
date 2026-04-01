import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.ts';
import { Paciente } from '../../pacientes/entities/paciente.entity.ts';

@Entity('radiografias')
export class Radiografia extends BaseEntity {
  @Column({ name: 'paciente_id' })
  pacienteId: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'nombre_archivo' })
  nombreArchivo: string;

  @Column({ type: 'text' })
  path: string;

  @Column()
  tipo: string; // periapical, panoramica, etc

  @Column({ name: 'fecha_toma', type: 'date', nullable: true })
  fechaToma: Date;
}
