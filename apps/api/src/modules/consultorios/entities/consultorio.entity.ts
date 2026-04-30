import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('consultorios')
export class Consultorio extends BaseEntity {
  @Column({ name: 'sucursal_id', nullable: true })
  sucursalId?: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column({ name: 'numero_sillones', type: 'int', default: 1 })
  numeroSillones!: number;

  @Column({ nullable: true })
  piso?: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  whatsapp?: string;

  @Column({ nullable: true })
  horario?: string;

  @Column({ type: 'jsonb', nullable: true })
  diasAtencion?: string[];

  @Column({ default: true })
  activo!: boolean;
}
