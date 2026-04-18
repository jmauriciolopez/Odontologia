import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PlanTratamiento } from './plan-tratamiento.entity';

@Entity('plan_tratamiento_items')
export class PlanTratamientoItem extends BaseEntity {
  @Column({ name: 'plan_id' })
  planId: string;

  @ManyToOne(() => PlanTratamiento, (plan) => plan.items)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanTratamiento;

  @Column()
  tipo: string; // extraccion, limpieza, etc

  @Column({ name: 'pieza_posicion', type: 'int', nullable: true })
  piezaPosicion: number;

  @Column({ name: 'cara', nullable: true })
  cara: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precioRef: number;

  @Column({ default: 'pendiente' })
  estado: string; // pendiente, iniciado, realizado, cancelado
}
