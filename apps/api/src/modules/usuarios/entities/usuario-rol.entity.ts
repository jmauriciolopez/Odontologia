import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Rol } from './rol.entity';

@Entity('usuario_roles')
export class UsuarioRol {
  @PrimaryColumn({ name: 'usuario_id' })
  usuarioId!: string;

  @PrimaryColumn({ name: 'rol_id' })
  rolId!: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRoles)
  @JoinColumn({ name: 'usuario_id' })
  usuario!: Usuario;

  @ManyToOne(() => Rol, (rol) => rol.usuarioRoles)
  @JoinColumn({ name: 'rol_id' })
  rol!: Rol;
}
