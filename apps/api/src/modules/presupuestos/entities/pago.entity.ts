import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Presupuesto } from './presupuesto.entity';

@Entity('pagos')
export class Pago extends BaseEntity {
  @Column({ name: 'presupuesto_id' })
  presupuestoId: string;

  @ManyToOne(() => Presupuesto, (presupuesto) => presupuesto.pagos)
  @JoinColumn({ name: 'presupuesto_id' })
  presupuesto: Presupuesto;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ name: 'metodo_pago' })
  metodoPago: string; // efectivo, tarjeta, transferencia

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  fechaPago: Date;
}
