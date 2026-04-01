import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FichaClinica } from './ficha-clinica.entity';

@Entity('antecedentes')
export class Antecedente extends BaseEntity {
  @Column({ name: 'ficha_id' })
  fichaId: string;

  @ManyToOne(() => FichaClinica, (ficha) => ficha.antecedentes)
  @JoinColumn({ name: 'ficha_id' })
  ficha: FichaClinica;

  @Column()
  tipo: string; // médico, dental, familiar

  @Column({ type: 'text' })
  descripcion: string;
}
