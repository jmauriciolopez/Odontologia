import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  usuarioRoles!: UsuarioRol[];
}
