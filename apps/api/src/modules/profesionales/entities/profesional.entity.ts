import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.ts';
import { Usuario } from '../../usuarios/entities/usuario.entity.ts';

@Entity('profesionales')
export class Profesional extends BaseEntity {
  @Column({ name: 'usuario_id' })
  usuarioId: string;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ nullable: true })
  especialidad: string;

  @Column({ nullable: true })
  matricula: string;
}
