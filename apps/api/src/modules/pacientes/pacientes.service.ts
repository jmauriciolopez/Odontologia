import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { FichasClinicasService } from '../fichas-clinicas/fichas-clinicas.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacienteFiltrosDto } from './dto/paciente-filtros.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
    private readonly fichasClinicasService: FichasClinicasService,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    const { documento } = createPacienteDto;

    if (documento) {
      const existingPatient = await this.pacientesRepository.findOne({ where: { documento } });
      if (existingPatient) {
        throw new ConflictException('El paciente con este documento ya existe');
      }
    }

    const paciente = this.pacientesRepository.create(createPacienteDto);
    return await this.pacientesRepository.save(paciente);
  }

  async findAll(filtros: PacienteFiltrosDto): Promise<PaginatedResponse<Paciente>> {
    const { query, page = 1, limit = 10 } = filtros;
    const qb = this.pacientesRepository.createQueryBuilder('paciente');

    if (query) {
      qb.where(
        'paciente.nombre ILIKE :query OR paciente.apellido ILIKE :query OR paciente.documento ILIKE :query OR paciente.telefono ILIKE :query',
        { query: `%${query}%` },
      );
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('paciente.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacientesRepository.findOne({
      where: { id },
      relations: ['ficha', 'ficha.antecedentes', 'ficha.evoluciones', 'obraSocialData', 'obraSocialData.prestaciones', 'obraSocialData.prestaciones.prestacion'],
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    // Si no tiene ficha, crearla automáticamente
    if (!paciente.ficha) {
      paciente.ficha = await this.fichasClinicasService.createFicha({
        pacienteId: paciente.id,
      });
    }

    // Ordenar evoluciones por fecha descendente
    if (paciente.ficha && paciente.ficha.evoluciones) {
      paciente.ficha.evoluciones.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    }

    return paciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.findOne(id);

    // Strip empty strings — don't overwrite existing values with ''
    const sanitized = Object.fromEntries(
      Object.entries(updatePacienteDto).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    ) as UpdatePacienteDto;

    this.pacientesRepository.merge(paciente, sanitized);
    return await this.pacientesRepository.save(paciente);
  }

  async remove(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    await this.pacientesRepository.softRemove(paciente);
  }
}
