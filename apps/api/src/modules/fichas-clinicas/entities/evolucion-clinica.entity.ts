import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.ts';
import { FichaClinica } from './ficha-clinica.entity.ts';

@Entity('evoluciones_clinicas')
export class EvolucionClinica extends BaseEntity {
  @Column({ name: 'ficha_id' })
  fichaId: string;

  @ManyToOne(() => FichaClinica, (ficha) => ficha.evoluciones)
  @JoinColumn({ name: 'ficha_id' })
  ficha: FichaClinica;

  @Column({ name: 'profesional_id' })
  profesionalId: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
