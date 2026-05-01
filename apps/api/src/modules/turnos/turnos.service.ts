import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Turno } from './entities/turno.entity';
import { CreateTurnoDto } from './dto/create-turnos.dto';
import { CreateTurnosRecurrentesDto } from './dto/create-turnos-recurrentes.dto';
import { UpdateTurnoDto } from './dto/update-turnos.dto';
import { TurnoFiltrosDto } from './dto/turnos-filtros.dto';
import { DisponibilidadQueryDto } from './dto/disponibilidad-query.dto';
import { ConfiguracionClinica } from '../configuracion/entities/configuracion-clinica.entity';
import { ConsultoriosService } from '../consultorios/consultorios.service';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';

import { TenantHelper } from '../../common/utils/tenant-helper';
import { ClsService } from 'nestjs-cls';

const MAX_RECURRENCIAS = 104;

@Injectable()
export class TurnosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
    @InjectRepository(ConfiguracionClinica)
    private readonly configRepository: Repository<ConfiguracionClinica>,
    private readonly consultoriosService: ConsultoriosService,
    private readonly cls: ClsService,
  ) {}

  private async checkHorarioConsultorio(consultorioId: string, inicio: Date, fin: Date): Promise<void> {
    await this.consultoriosService.validarDisponibilidadHoraria(consultorioId, inicio, fin);
  }

  private async checkConflict(
    inicio: Date,
    fin: Date,
    profesionalId: string,
    consultorioId: string,
    excludeTurnoId?: string,
    repo?: Repository<Turno>,
  ): Promise<void> {
    const turnoRepo = repo ?? this.turnosRepository;
    const qb = turnoRepo.createQueryBuilder('turno');
    TenantHelper.applyFilter(qb, this.cls);

    qb.where('turno.estado NOT IN (:...estadosIgnorar)', { estadosIgnorar: ['cancelado'] })
      .andWhere(
        '((turno.fechaInicio < :fin AND turno.fechaFin > :inicio))',
        { inicio, fin }
      )
      .andWhere(
        '(turno.profesionalId = :profesionalId OR turno.consultorioId = :consultorioId)',
        { profesionalId, consultorioId }
      );

    if (excludeTurnoId) {
      qb.andWhere('turno.id != :excludeTurnoId', { excludeTurnoId });
    }

    const conflicto = await qb.getOne();

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

    await this.checkHorarioConsultorio(consultorioId, inicio, fin);
    await this.checkConflict(inicio, fin, profesionalId, consultorioId);

    const turno = this.turnosRepository.create({
      ...createTurnoDto,
      fechaInicio: inicio,
      fechaFin: fin,
    });

    return await this.turnosRepository.save(turno);
  }

  private toLocalYmd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private nextOccurrence(current: Date, frecuencia: string): Date {
    const d = new Date(current);
    switch (frecuencia) {
      case 'diaria':
        d.setDate(d.getDate() + 1);
        return d;
      case 'semanal':
        d.setDate(d.getDate() + 7);
        return d;
      case 'quincenal':
        d.setDate(d.getDate() + 14);
        return d;
      case 'mensual':
        d.setMonth(d.getMonth() + 1);
        return d;
      default:
        throw new BadRequestException('Frecuencia inválida');
    }
  }

  async createRecurrentes(dto: CreateTurnosRecurrentesDto): Promise<Turno[]> {
    const inicio = new Date(dto.fechaInicio);
    const fin = new Date(dto.fechaFin);

    if (fin <= inicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio');
    }

    const duracionMs = fin.getTime() - inicio.getTime();

    if (dto.finSerie === 'fecha') {
      const hasta = dto.hastaFecha!;
      if (this.toLocalYmd(inicio) > hasta) {
        throw new BadRequestException('La fecha límite de la serie debe ser posterior o igual al primer turno');
      }
    } else if (dto.finSerie === 'cantidad') {
      if (!dto.cantidad || dto.cantidad < 2) {
        throw new BadRequestException('La cantidad debe ser al menos 2');
      }
    }

    const serieId = randomUUID();

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Turno);
      const creados: Turno[] = [];
      let cursorStart = new Date(inicio);
      let count = 0;

      while (count < MAX_RECURRENCIAS) {
        if (dto.finSerie === 'fecha') {
          if (this.toLocalYmd(cursorStart) > dto.hastaFecha!) {
            break;
          }
        }
        if (dto.finSerie === 'cantidad' && count >= dto.cantidad!) {
          break;
        }

        const fi = new Date(cursorStart);
        const ff = new Date(cursorStart.getTime() + duracionMs);

        await this.checkConflict(fi, ff, dto.profesionalId, dto.consultorioId, undefined, repo);

        const turno = repo.create({
          pacienteId: dto.pacienteId,
          profesionalId: dto.profesionalId,
          consultorioId: dto.consultorioId,
          sucursalId: dto.sucursalId,
          fechaInicio: fi,
          fechaFin: ff,
          estado: dto.estado ?? 'programado',
          motivo: dto.motivo,
          serieRecurrenciaId: serieId,
        });
        creados.push(turno);
        count++;

        if (dto.finSerie === 'cantidad' && count >= dto.cantidad!) {
          break;
        }

        cursorStart = this.nextOccurrence(cursorStart, dto.frecuencia);
      }

      if (creados.length === 0) {
        throw new BadRequestException('No se generó ningún turno con los criterios indicados');
      }

      return await repo.save(creados);
    });
  }

  async findAll(filtros: TurnoFiltrosDto): Promise<PaginatedResponse<Turno>> {
    const { fecha, desde, hasta, profesionalId, consultorioId, pacienteId, estado, page = 1, limit = 10 } = filtros;
    const qb = this.turnosRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.paciente', 'paciente')
      .leftJoinAndSelect('turno.profesional', 'profesional')
      .leftJoinAndSelect('turno.consultorio', 'consultorio');

    TenantHelper.applyFilter(qb, this.cls);

    if (fecha) {
      qb.andWhere('CAST(turno.fechaInicio AS date) = CAST(:fecha AS date)', { fecha });
    }
    if (desde && hasta) {
      const d = typeof desde === 'string' ? desde.split('T')[0] : desde;
      const h = typeof hasta === 'string' ? hasta.split('T')[0] : hasta;
      qb.andWhere('CAST(turno.fechaInicio AS date) >= CAST(:desde AS date)', { desde: d });
      qb.andWhere('CAST(turno.fechaInicio AS date) <= CAST(:hasta AS date)', { hasta: h });
    } else if (desde) {
      const d = typeof desde === 'string' ? desde.split('T')[0] : desde;
      qb.andWhere('CAST(turno.fechaInicio AS date) >= CAST(:desde AS date)', { desde: d });
    } else if (hasta) {
      const h = typeof hasta === 'string' ? hasta.split('T')[0] : hasta;
      qb.andWhere('CAST(turno.fechaInicio AS date) <= CAST(:hasta AS date)', { hasta: h });
    }
    if (profesionalId) {
      qb.andWhere('turno.profesionalId = :profesionalId', { profesionalId });
    }
    if (consultorioId) {
      qb.andWhere('turno.consultorioId = :consultorioId', { consultorioId });
    }
    if (pacienteId) {
      qb.andWhere('turno.pacienteId = :pacienteId', { pacienteId });
    }
    if (estado) {
      qb.andWhere('turno.estado = :estado', { estado });
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('turno.fechaInicio', 'ASC');

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

  async findOne(id: string): Promise<Turno> {
    const turno = await this.turnosRepository.findOne(
      TenantHelper.withTenantOne(this.cls, {
        where: { id },
        relations: ['paciente', 'profesional', 'profesional.usuario', 'consultorio'],
      })
    );

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
      await this.checkHorarioConsultorio(consultorioId, inicio, fin);
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

    const qb = this.turnosRepository.createQueryBuilder('turno');
    TenantHelper.applyFilter(qb, this.cls);

    qb.where('turno.estado NOT IN (:...estadosIgnorar)', { estadosIgnorar: ['cancelado'] })
      .andWhere('turno.fechaInicio < :fin AND turno.fechaFin > :inicio', { inicio, fin })
      .andWhere(
        '(turno.profesionalId = :profesionalId OR turno.consultorioId = :consultorioId)',
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
