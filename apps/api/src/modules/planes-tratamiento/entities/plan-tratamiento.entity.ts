import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Profesional } from '../../profesionales/entities/profesional.entity';
import { PlanTratamientoItem } from './plan-tratamiento-item.entity';

@Entity('planes_tratamiento')
export class PlanTratamiento extends BaseEntity {
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

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ default: 'borrador' })
  estado: string; // borrador, activo, completado, cancelado

  @OneToMany(() => PlanTratamientoItem, (item) => item.plan)
  items: PlanTratamientoItem[];
}
