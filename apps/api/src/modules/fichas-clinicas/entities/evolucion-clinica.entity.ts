import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FichaClinica } from './ficha-clinica.entity';

@Entity('evoluciones_clinicas')
export class EvolucionClinica extends BaseEntity {
  @Index()
  @Column({ name: 'ficha_id' })
  fichaId!: string;

  @ManyToOne(() => FichaClinica, (ficha) => ficha.evoluciones)
  @JoinColumn({ name: 'ficha_id' })
  ficha!: FichaClinica;

  @Index()
  @Column({ name: 'profesional_id', type: 'uuid', nullable: true })
  profesionalId?: string | null;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ name: 'categoria', type: 'varchar', length: 50, nullable: true, default: 'General' })
  categoria?: string;

  @Index()
  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;
}
