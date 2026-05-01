import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { UsuarioRol } from './entities/usuario-rol.entity';
import { Profesional } from '../profesionales/entities/profesional.entity';
import { TenantHelper } from '../../common/utils/tenant-helper';
import { ClsService } from 'nestjs-cls';

const ODONTOLOGO_ROLE = 'PROFESIONAL';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>,
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolesRepository: Repository<UsuarioRol>,
    @InjectRepository(Profesional)
    private readonly profesionalesRepository: Repository<Profesional>,
    private readonly cls: ClsService,
  ) { }

  private async ensureProfesional(usuarioId: string): Promise<void> {
    const exists = await this.profesionalesRepository.findOne(
      TenantHelper.withTenant(this.cls, { where: { usuarioId } })
    );
    if (!exists) {
      await this.profesionalesRepository.save(
        this.profesionalesRepository.create({ usuarioId })
      );
    }
  }

  private async removeProfesionalIfNeeded(usuarioId: string, rolIds: string[]): Promise<void> {
    const roles = await this.rolesRepository.find({ where: { id: In(rolIds) } });
    const hasOdontologo = roles.some(r => r.nombre.toUpperCase() === ODONTOLOGO_ROLE);
    if (!hasOdontologo) {
      const profesional = await this.profesionalesRepository.findOne(
        TenantHelper.withTenant(this.cls, { where: { usuarioId } })
      );
      if (profesional) await this.profesionalesRepository.remove(profesional);
    }
  }

  async findAllRoles(): Promise<Rol[]> {
    return await this.rolesRepository.find();
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { email, password, rolIds, ...rest } = createUsuarioDto;

    const existingUser = await this.usuariosRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = this.usuariosRepository.create({
      ...rest,
      email,
      passwordHash,
    });

    const savedUser = await this.usuariosRepository.save(usuario);

    if (rolIds && rolIds.length > 0) {
      const userRoles = rolIds.map(rolId =>
        this.usuarioRolesRepository.create({
          usuarioId: savedUser.id,
          rolId,
        })
      );
      await this.usuarioRolesRepository.save(userRoles);

      // Auto-create profesional if ODONTOLOGO role is assigned
      const assignedRoles = await this.rolesRepository.find({ where: { id: In(rolIds) } });
      const isOdontologo = assignedRoles.some(r => r.nombre.toUpperCase() === ODONTOLOGO_ROLE);
      if (isOdontologo) await this.ensureProfesional(savedUser.id);
    }

    return await this.findOne(savedUser.id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const qb = this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.passwordHash')
      .leftJoinAndSelect('usuario.usuarioRoles', 'usuarioRoles')
      .leftJoinAndSelect('usuarioRoles.rol', 'rol')
      .where('usuario.email = :email', { email });

    TenantHelper.applyFilter(qb, this.cls, 'usuario');

    return await qb.getOne();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne(
      TenantHelper.withTenant(this.cls, {
        where: { id },
        relations: ['usuarioRoles', 'usuarioRoles.rol'],
      })
    );

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuariosRepository.find(
      TenantHelper.withTenant(this.cls, {
        relations: ['usuarioRoles', 'usuarioRoles.rol'],
      })
    );
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const usuario = await this.findOne(id);
    usuario.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usuariosRepository.save(usuario);
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (dto.nombre !== undefined) usuario.nombre = dto.nombre;
    if (dto.apellido !== undefined) usuario.apellido = dto.apellido;
    if (dto.activo !== undefined) usuario.activo = dto.activo;

    await this.usuariosRepository.save(usuario);

    if (dto.rolIds !== undefined) {
      await this.usuarioRolesRepository.delete({ usuarioId: id });
      if (dto.rolIds.length > 0) {
        const userRoles = dto.rolIds.map(rolId =>
          this.usuarioRolesRepository.create({ usuarioId: id, rolId })
        );
        await this.usuarioRolesRepository.save(userRoles);
      }

      // Sync profesional record based on updated roles
      const assignedRoles = await this.rolesRepository.find({ where: { id: In(dto.rolIds) } });
      const isOdontologo = assignedRoles.some(r => r.nombre.toUpperCase() === ODONTOLOGO_ROLE);
      if (isOdontologo) {
        await this.ensureProfesional(id);
      } else {
        await this.removeProfesionalIfNeeded(id, dto.rolIds);
      }
    }

    return await this.findOne(id);
  }
}
