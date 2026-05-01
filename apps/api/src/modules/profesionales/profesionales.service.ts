import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profesional } from './entities/profesional.entity';
import { CreateProfesionalDto } from './dto/create-profesional.dto';
import { UpdateProfesionalDto } from './dto/update-profesional.dto';
import { TenantHelper } from '../../common/utils/tenant-helper';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ProfesionalesService {
  constructor(
    @InjectRepository(Profesional)
    private readonly profesionalesRepository: Repository<Profesional>,
    private readonly cls: ClsService,
  ) {}

  async create(createProfesionalDto: CreateProfesionalDto): Promise<Profesional> {
    const { usuarioId } = createProfesionalDto;

    const existing = await this.profesionalesRepository.findOne(
      TenantHelper.withTenant(this.cls, { where: { usuarioId } })
    );
    if (existing) {
      throw new ConflictException('Este usuario ya tiene un perfil profesional');
    }

    const profesional = this.profesionalesRepository.create(createProfesionalDto);
    return await this.profesionalesRepository.save(profesional);
  }

  async findAll(): Promise<Profesional[]> {
    return await this.profesionalesRepository.find(
      TenantHelper.withTenant(this.cls, { relations: ['usuario'] })
    );
  }

  async findOne(id: string): Promise<Profesional> {
    const profesional = await this.profesionalesRepository.findOne(
      TenantHelper.withTenant(this.cls, {
        where: { id },
        relations: ['usuario'],
      })
    );

    if (!profesional) {
      throw new NotFoundException(`Profesional con ID ${id} no encontrado`);
    }

    return profesional;
  }

  async update(id: string, updateProfesionalDto: UpdateProfesionalDto): Promise<Profesional> {
    const profesional = await this.findOne(id);
    this.profesionalesRepository.merge(profesional, updateProfesionalDto);
    return await this.profesionalesRepository.save(profesional);
  }

  async remove(id: string): Promise<void> {
    const profesional = await this.findOne(id);
    await this.profesionalesRepository.remove(profesional);
  }
}
