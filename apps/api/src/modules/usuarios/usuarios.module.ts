import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity.ts';
import { Rol } from './entities/rol.entity.ts';
import { UsuarioRol } from './entities/usuario-rol.entity.ts';
import { UsuariosService } from './usuarios.service.ts';
import { UsuariosController } from './usuarios.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol, UsuarioRol])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
