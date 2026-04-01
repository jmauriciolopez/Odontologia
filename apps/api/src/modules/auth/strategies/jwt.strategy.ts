import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from '../../../config/env.ts';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface.ts';
import { UsuariosService } from '../../usuarios/usuarios.service.ts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT.SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: id } = payload;
    const user = await this.usuariosService.findOne(id);

    if (!user || !user.activo) {
      throw new UnauthorizedException('Usuario no válido');
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.usuarioRoles.map((ur) => ur.rol.nombre),
    };
  }
}
