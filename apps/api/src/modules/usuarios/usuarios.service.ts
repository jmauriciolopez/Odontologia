import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.ts';
import { CreateUsuarioDto } from './dto/create-usuario.dto.ts';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { email, password, ...rest } = createUsuarioDto;

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

    return await this.usuariosRepository.save(usuario);
  }

  async findByEmail(email: string): Promise<Usuario | undefined> {
    return await this.usuariosRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password_hash')
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
