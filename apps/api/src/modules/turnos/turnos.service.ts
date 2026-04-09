import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turnos.dto';
import { UpdateTurnoDto } from './dto/update-turnos.dto';
import { TurnoFiltrosDto } from './dto/turnos-filtros.dto';
import { DisponibilidadQueryDto } from './dto/disponibilidad-query.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
  ) {}

  private async checkConflict(
    inicio: Date,
    fin: Date,
    profesionalId: string,
    consultorioId: string,
    excludeTurnoId?: string,
  ): Promise<void> {
    const query = this.turnosRepository.createQueryBuilder('turno')
      .where('turno.estado NOT IN (:...estadosIgnorar)', { estadosIgnorar: ['cancelado'] })
      .andWhere(
        '((turno.fecha_inicio < :fin AND turno.fecha_fin > :inicio))',
        { inicio, fin }
      )
      .andWhere(
        '(turno.profesional_id = :profesionalId OR turno.consultorio_id = :consultorioId)',
        { profesionalId, consultorioId }
      );

    if (excludeTurnoId) {
      query.andWhere('turno.id != :excludeTurnoId', { excludeTurnoId });
    }

    const conflicto = await query.getOne();

    if (conflicto) {
      if (conflicto.profesionalId === profesionalId) {
        throw new BadRequestException('El profesional ya tiene un turno asignado en ese horario');
      }
      if (conflicto.consultorioId === consultorioId) {
        throw new BadRequestException('El consultorio ya está ocupado en ese horario');
      }
    }
  }

  async create(createTurnoDto: CreateTurnoDto): Promise<Turno> {
    const { fechaInicio, fechaFin, profesionalId, consultorioId } = createTurnoDto;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin <= inicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio');
    }

    await this.checkConflict(inicio, fin, profesionalId, consultorioId);

    const turno = this.turnosRepository.create({
      ...createTurnoDto,
      fechaInicio: inicio,
      fechaFin: fin,
    });

    return await this.turnosRepository.save(turno);
  }

  async findAll(filtros: TurnoFiltrosDto): Promise<Turno[]> {
    const { fecha, desde, hasta, profesionalId, pacienteId, estado } = filtros;
    const qb = this.turnosRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.paciente', 'paciente')
      .leftJoinAndSelect('turno.profesional', 'profesional')
      .leftJoinAndSelect('profesional.usuario', 'usuario_prof')
      .leftJoinAndSelect('turno.consultorio', 'consultorio');

    if (fecha) {
      qb.andWhere('DATE(turno.fecha_inicio) = :fecha', { fecha });
    }
    if (desde && hasta) {
      qb.andWhere('turno.fecha_inicio BETWEEN :desde AND :hasta', { desde, hasta });
    } else if (desde) {
      qb.andWhere('turno.fecha_inicio >= :desde', { desde });
    } else if (hasta) {
      qb.andWhere('turno.fecha_inicio <= :hasta', { hasta });
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

    const inicio = updateTurnoDto.fechaInicio ? new Date(updateTurnoDto.fechaInicio) : turno.fechaInicio;
    const fin = updateTurnoDto.fechaFin ? new Date(updateTurnoDto.fechaFin) : turno.fechaFin;
    const profesionalId = updateTurnoDto.profesionalId || turno.profesionalId;
    const consultorioId = updateTurnoDto.consultorioId || turno.consultorioId;

    if (fin <= inicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio');
    }

    // Solo verificamos conflictos si cambian horarios o recursos
    if (updateTurnoDto.fechaInicio || updateTurnoDto.fechaFin || updateTurnoDto.profesionalId || updateTurnoDto.consultorioId) {
      await this.checkConflict(inicio, fin, profesionalId, consultorioId, id);
    }

    this.turnosRepository.merge(turno, updateTurnoDto);
    return await this.turnosRepository.save(turno);
  }

  async remove(id: string): Promise<void> {
    const turno = await this.findOne(id);
    await this.turnosRepository.remove(turno);
  }

  async checkDisponibilidad(query: DisponibilidadQueryDto): Promise<{
    disponible: boolean;
    conflictos: { tipo: string; turnoId: string; fechaInicio: Date; fechaFin: Date }[];
  }> {
    const inicio = new Date(query.fechaInicio);
    const fin = new Date(query.fechaFin);

    const qb = this.turnosRepository.createQueryBuilder('turno')
      .where('turno.estado NOT IN (:...estadosIgnorar)', { estadosIgnorar: ['cancelado'] })
      .andWhere('turno.fecha_inicio < :fin AND turno.fecha_fin > :inicio', { inicio, fin })
      .andWhere(
        '(turno.profesional_id = :profesionalId OR turno.consultorio_id = :consultorioId)',
        { profesionalId: query.profesionalId, consultorioId: query.consultorioId }
      );

    if (query.excludeTurnoId) {
      qb.andWhere('turno.id != :excludeTurnoId', { excludeTurnoId: query.excludeTurnoId });
    }

    const conflictivos = await qb.getMany();

    const conflictos = conflictivos.map(t => ({
      tipo: t.profesionalId === query.profesionalId ? 'profesional' : 'consultorio',
      turnoId: t.id,
      fechaInicio: t.fechaInicio,
      fechaFin: t.fechaFin,
    }));

    return {
      disponible: conflictos.length === 0,
      conflictos,
    };
  }
}
