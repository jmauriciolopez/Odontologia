import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from '../../config/env.ts';
import { UsuariosModule } from '../usuarios/usuarios.module.ts';
import { AuthService } from './auth.service.ts';
import { AuthController } from './auth.controller.ts';
import { JwtStrategy } from './strategies/jwt.strategy.ts';

@Module({
  imports: [
    UsuariosModule,
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
