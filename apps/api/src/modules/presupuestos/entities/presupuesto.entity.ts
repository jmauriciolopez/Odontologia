import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { PlanTratamiento } from '../../planes-tratamiento/entities/plan-tratamiento.entity';
import { PresupuestoItem } from './presupuesto-item.entity';
import { Pago } from './pago.entity';

@Entity('presupuestos')
export class Presupuesto extends BaseEntity {
  @Column({ name: 'paciente_id' })
  pacienteId: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'plan_id', nullable: true })
  planId: string;

  @ManyToOne(() => PlanTratamiento)
  @JoinColumn({ name: 'plan_id' })
  plan: PlanTratamiento;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalPagado: number;

  @Column({ default: 'pendiente' })
  estado: string; // pendiente, aceptado, rechazado, pagado, pagado_parcial

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  fechaPresupuesto: Date;

  @OneToMany(() => PresupuestoItem, (item) => item.presupuesto)
  items: PresupuestoItem[];

  @OneToMany(() => Pago, (pago) => pago.presupuesto)
  pagos: Pago[];
}
