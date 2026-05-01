import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../../config/env';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { ClinicasModule } from '../clinicas/clinicas.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Rol } from '../usuarios/entities/rol.entity';
import { UsuarioRol } from '../usuarios/entities/usuario-rol.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    UsuariosModule,
    ClinicasModule,
    TypeOrmModule.forFeature([Rol, UsuarioRol, Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: env.JWT.SECRET,
      signOptions: { expiresIn: env.JWT.EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
