import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('consultorios')
export class Consultorio extends BaseEntity {
  @Column({ name: 'sucursal_id', nullable: true })
  sucursalId: string;

  @Column()
  nombre: string;

  @Column({ default: true })
  activo: boolean;
}
