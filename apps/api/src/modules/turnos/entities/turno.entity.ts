import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { Consultorio } from '../../consultorios/entities/consultorio.entity';

@Entity('turnos')
export class Turno extends BaseEntity {
  @Column({ name: 'sucursal_id', nullable: true })
  sucursalId: string;

  @Column({ name: 'paciente_id' })
  pacienteId: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'profesional_id' })
  profesionalId: string;

  @ManyToOne(() => Profesional)
  @JoinColumn({ name: 'profesional_id' })
  profesional: Profesional;

  @Column({ name: 'consultorio_id' })
  consultorioId: string;

  @ManyToOne(() => Consultorio)
  @JoinColumn({ name: 'consultorio_id' })
  consultorio: Consultorio;

  @Column({ name: 'fecha_inicio', type: 'timestamp with time zone' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp with time zone' })
  fechaFin: Date;

  @Column({ default: 'programado' })
  estado: string; // programado, confirmado, atendido, cancelado, ausente

  @Column({ type: 'text', nullable: true })
  motivo: string;
}
