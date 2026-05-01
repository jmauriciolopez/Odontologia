import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { ClinicasService } from '../clinicas/clinicas.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from '../usuarios/entities/rol.entity';
import { Repository } from 'typeorm';
import { UsuarioRol } from '../usuarios/entities/usuario-rol.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly clinicasService: ClinicasService,
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>,
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolesRepository: Repository<UsuarioRol>,
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usuariosService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.usuarioRoles.map((ur) => ur.rol.nombre),
      clinicaId: user.clinicaId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        roles: payload.roles,
        clinica: user.clinica ? {
          id: user.clinica.id,
          nombre: user.clinica.nombre,
          plan: user.clinica.plan,
          trialExpiresAt: user.clinica.trialExpiresAt,
          maxPatients: user.clinica.maxPatients,
        } : null,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { clinicaNombre, email, password, nombre, apellido } = registerDto;

    // 1. Crear Clínica
    const clinica = await this.clinicasService.create(clinicaNombre);

    // 2. Crear Usuario Administrador
    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = this.usuariosRepository.create({
      email,
      passwordHash,
      nombre,
      apellido,
      clinicaId: clinica.id,
    });

    const savedUser = await this.usuariosRepository.save(usuario);

    // 3. Asignar Rol ADMIN
    let adminRole = await this.rolesRepository.findOne({ where: { nombre: 'ADMIN' } });
    if (!adminRole) {
      // Fallback si no existe el rol ADMIN (esto debería estar en seeders)
      adminRole = await this.rolesRepository.save(
        this.rolesRepository.create({ nombre: 'ADMIN', descripcion: 'Administrador de Clínica' })
      );
    }

    await this.usuarioRolesRepository.save(
      this.usuarioRolesRepository.create({
        usuarioId: savedUser.id,
        rolId: adminRole.id,
      })
    );

    // 4. Login automático
    return this.login({ email, password });
  }
}
