import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UsuarioRol } from './usuario-rol.entity';
import { Clinica } from '../../clinicas/entities/clinica.entity';

@Entity('usuarios')
export class Usuario extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash!: string;

  @Column({ nullable: true })
  nombre?: string;

  @Column({ nullable: true })
  apellido?: string;

  @Column({ default: true })
  activo!: boolean;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.usuario)
  usuarioRoles!: UsuarioRol[];
  
  @ManyToOne(() => Clinica, (clinica) => clinica.usuarios)
  @JoinColumn({ name: 'clinica_id' })
  clinica!: Clinica;
}
