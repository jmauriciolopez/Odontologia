import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.ts';
import { UsuarioRol } from './usuario-rol.entity.ts';

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  apellido: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  usuarioRoles: UsuarioRol[];
}
