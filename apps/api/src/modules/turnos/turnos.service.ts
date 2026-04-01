import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './entities/turno.entity.ts';
import { CreateTurnoDto } from './dto/create-turnos.dto.ts';
import { UpdateTurnoDto } from './dto/update-turnos.dto.ts';
import { TurnoFiltrosDto } from './dto/turnos-filtros.dto.ts';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
  ) {}

  async create(createTurnoDto: CreateTurnoDto): Promise<Turno> {
    const { fechaInicio, fechaFin } = createTurnoDto;
    
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio');
    }

    const turno = this.turnosRepository.create({
      ...createTurnoDto,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
    });

    return await this.turnosRepository.save(turno);
  }

  async findAll(filtros: TurnoFiltrosDto): Promise<Turno[]> {
    const { fecha, profesionalId, pacienteId, estado } = filtros;
    const qb = this.turnosRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.paciente', 'paciente')
      .leftJoinAndSelect('turno.profesional', 'profesional')
      .leftJoinAndSelect('profesional.usuario', 'usuario_prof')
      .leftJoinAndSelect('turno.consultorio', 'consultorio');

    if (fecha) {
      qb.andWhere('DATE(turno.fecha_inicio) = :fecha', { fecha });
    }
    if (profesionalId) {
      qb.andWhere('turno.profesional_id = :profesionalId', { profesionalId });
    }
    if (pacienteId) {
      qb.andWhere('turno.paciente_id = :pacienteId', { pacienteId });
    }
    if (estado) {
      qb.andWhere('turno.estado = :estado', { estado });
    }

    return await qb.orderBy('turno.fecha_inicio', 'ASC').getMany();
  }

  async findOne(id: string): Promise<Turno> {
    const turno = await this.turnosRepository.findOne({
      where: { id },
      relations: ['paciente', 'profesional', 'profesional.usuario', 'consultorio'],
    });

    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    }

    return turno;
  }

  async update(id: string, updateTurnoDto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);
    
    if (updateTurnoDto.fechaInicio || updateTurnoDto.fechaFin) {
      const inicio = updateTurnoDto.fechaInicio ? new Date(updateTurnoDto.fechaInicio) : turno.fechaInicio;
      const fin = updateTurnoDto.fechaFin ? new Date(updateTurnoDto.fechaFin) : turno.fechaFin;
      if (fin <= inicio) {
        throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio');
      }
    }

    this.turnosRepository.merge(turno, updateTurnoDto);
    return await this.turnosRepository.save(turno);
  }

  async remove(id: string): Promise<void> {
    const turno = await this.findOne(id);
    await this.turnosRepository.remove(turno);
  }
}
