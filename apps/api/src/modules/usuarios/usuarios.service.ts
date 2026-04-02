import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcryptjs';

import { UsuarioRol } from './entities/usuario-rol.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolesRepository: Repository<Rol>,
    @InjectRepository(UsuarioRol)
    private readonly usuarioRolesRepository: Repository<UsuarioRol>,
  ) { }

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
    }

    return await this.findOne(savedUser.id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.passwordHash')
      .leftJoinAndSelect('usuario.usuarioRoles', 'usuarioRoles')
      .leftJoinAndSelect('usuarioRoles.rol', 'rol')
      .where('usuario.email = :email', { email })
      .getOne();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['usuarioRoles', 'usuarioRoles.rol'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuariosRepository.find({
      relations: ['usuarioRoles', 'usuarioRoles.rol'],
    });
  }
}
