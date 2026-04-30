import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PiezaDental } from './pieza-dental.entity';

@Entity('procedimientos_piezas')
export class ProcedimientoPieza extends BaseEntity {
  @Column({ name: 'pieza_id' })
  piezaId!: string;

  @ManyToOne(() => PiezaDental, (pieza) => pieza.procedimientos)
  @JoinColumn({ name: 'pieza_id' })
  pieza!: PiezaDental;

  @Column()
  tipo!: string; // extraccion, corona, caries, etc

  @Column({ nullable: true })
  cara?: string; // V, L, O, D, M o GENERAL

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ name: 'fecha_realizacion', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  fechaRealizacion!: Date;
}
