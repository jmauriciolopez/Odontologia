import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Presupuesto } from './presupuesto.entity';

@Entity('presupuesto_items')
export class PresupuestoItem extends BaseEntity {
  @Column({ name: 'presupuesto_id' })
  presupuestoId!: string;

  @ManyToOne(() => Presupuesto, (presupuesto) => presupuesto.items)
  @JoinColumn({ name: 'presupuesto_id' })
  presupuesto!: Presupuesto;

  @Column()
  descripcion!: string;

  @Column({ type: 'int', default: 1 })
  cantidad!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precioUnitario!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  descuento!: number; // Porcentaje o monto, asumamos monto por simplificación en esta etapa

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal!: number;
}
