import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './entities/paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacienteFiltrosDto } from './dto/paciente-filtros.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacientesRepository: Repository<Paciente>,
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

  async findAll(filtros: PacienteFiltrosDto): Promise<Paciente[]> {
    const { query } = filtros;
    const qb = this.pacientesRepository.createQueryBuilder('paciente');

    if (query) {
      qb.where(
        'paciente.nombre ILIKE :query OR paciente.apellido ILIKE :query OR paciente.documento ILIKE :query OR paciente.telefono ILIKE :query',
        { query: `%${query}%` },
      );
    }

    return await qb.getMany();
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacientesRepository.findOne({
      where: { id },
      relations: ['fichaClinica', 'fichaClinica.antecedentes', 'fichaClinica.evoluciones'],
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    // Ordenar evoluciones por fecha descendente
    if (paciente.fichaClinica && paciente.fichaClinica.evoluciones) {
      paciente.fichaClinica.evoluciones.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    }

    return paciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.findOne(id);
    this.pacientesRepository.merge(paciente, updatePacienteDto);
    return await this.pacientesRepository.save(paciente);
  }

  async remove(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    await this.pacientesRepository.softRemove(paciente);
  }
}
