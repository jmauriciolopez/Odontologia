import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FichaClinica } from '../../fichas-clinicas/entities/ficha-clinica.entity';
import { ProcedimientoPieza } from './procedimiento-pieza.entity';

@Entity('piezas_dentales')
export class PiezaDental extends BaseEntity {
  @Column({ name: 'ficha_id' })
  fichaId!: string;

  @ManyToOne(() => FichaClinica)
  @JoinColumn({ name: 'ficha_id' })
  ficha!: FichaClinica;

  @Column({ type: 'int' })
  posicion!: number; // 11-18, 21-28, 31-38, 41-48, 51-55, 61-65, 71-75, 81-85

  @Column({ type: 'jsonb', nullable: true })
  caras?: {
    vestibular?: string;
    lingual?: string;
    oclusal?: string;
    distal?: string;
    mesial?: string;
  };

  @OneToMany(() => ProcedimientoPieza, (procedimiento) => procedimiento.pieza)
  procedimientos!: ProcedimientoPieza[];
}
