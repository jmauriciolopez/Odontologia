import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { Consultorio } from '../../consultorios/entities/consultorio.entity';

@Entity('turnos')
export class Turno extends BaseEntity {
  @Column({ name: 'sucursal_id', nullable: true })
  sucursalId?: string;

  @Index()
  @Column({ name: 'paciente_id' })
  pacienteId!: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente!: Paciente;

  @Index()
  @Column({ name: 'profesional_id' })
  profesionalId!: string;

  @ManyToOne(() => Profesional)
  @JoinColumn({ name: 'profesional_id' })
  profesional!: Profesional;

  @Index()
  @Column({ name: 'consultorio_id' })
  consultorioId!: string;

  @ManyToOne(() => Consultorio)
  @JoinColumn({ name: 'consultorio_id' })
  consultorio!: Consultorio;

  @Index()
  @Column({ name: 'fecha_inicio', type: 'timestamp with time zone' })
  fechaInicio!: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp with time zone' })
  fechaFin!: Date;

  @Column({ default: 'programado' })
  estado!: string; // programado, confirmado, atendido, cancelado, ausente

  @Column({ type: 'text', nullable: true })
  motivo?: string;

  /** Mismo UUID en todos los turnos de una serie recurrente (solo relleno al crear series). */
  @Column({ name: 'serie_recurrencia_id', type: 'uuid', nullable: true })
  serieRecurrenciaId?: string;
}
