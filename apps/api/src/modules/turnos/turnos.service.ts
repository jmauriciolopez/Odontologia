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
import { Consultorio } from '../consultorios/entities/consultorio.entity';

const MAX_RECURRENCIAS = 104;

// Mapeo día JS (0=domingo) → nombre usado en diasAtencion del consultorio
const DIA_NOMBRE: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

@Injectable()
export class TurnosService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
    @InjectRepository(ConfiguracionClinica)
    private readonly configRepository: Repository<ConfiguracionClinica>,
    @InjectRepository(Consultorio)
    private readonly consultorioRepository: Repository<Consultorio>,
  ) {}

  private async checkHorarioConsultorio(consultorioId: string, inicio: Date, fin: Date): Promise<void> {
    const consultorio = await this.consultorioRepository.findOneBy({ id: consultorioId });
    if (!consultorio) return;

    // Validar día de atención
    const diaNombre = DIA_NOMBRE[inicio.getUTCDay()];
    if (consultorio.diasAtencion?.length > 0) {
      // Normalizar para comparar sin tildes ni mayúsculas
      const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const atiende = consultorio.diasAtencion.some(d => normalize(d) === normalize(diaNombre));
      if (!atiende) {
        throw new BadRequestException(
          `El consultorio "${consultorio.nombre}" no atiende los ${diaNombre}`
        );
      }
    }

    // Validar horario — formato esperado: "HH:MM - HH:MM" o "HH:MM - HH:MM, HH:MM - HH:MM"
    if (consultorio.horario?.trim()) {
      const toMin = (hhmm: string) => {
        const [h, m] = hhmm.trim().split(':').map(Number);
        return h * 60 + m;
      };
      const inicioMin = inicio.getUTCHours() * 60 + inicio.getUTCMinutes();
      const finMin    = fin.getUTCHours()    * 60 + fin.getUTCMinutes();

      // Soporta múltiples rangos separados por coma
      const rangos = consultorio.horario.split(',').map(r => r.trim());
      const dentroDeAlgunRango = rangos.some(rango => {
        const partes = rango.split('-').map(p => p.trim());
        if (partes.length !== 2) return true; // formato desconocido, no bloquear
        const desde = toMin(partes[0]);
        const hasta = toMin(partes[1]);
        return inicioMin >= desde && finMin <= hasta;
      });

      if (!dentroDeAlgunRango) {
        throw new BadRequestException(
          `El horario del turno está fuera del horario operativo del consultorio "${consultorio.nombre}" (${consultorio.horario})`
        );
      }
    }
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
    const query = turnoRepo.createQueryBuilder('turno')
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
        creados.push(await repo.save(turno));
        count++;

        if (dto.finSerie === 'cantidad' && count >= dto.cantidad!) {
          break;
        }

        cursorStart = this.nextOccurrence(cursorStart, dto.frecuencia);
      }

      if (creados.length === 0) {
        throw new BadRequestException('No se generó ningún turno con los criterios indicados');
      }

      return creados;
    });
  }

  async findAll(filtros: TurnoFiltrosDto): Promise<Turno[]> {
    const { fecha, desde, hasta, profesionalId, consultorioId, pacienteId, estado } = filtros;
    const qb = this.turnosRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.paciente', 'paciente')
      .leftJoinAndSelect('turno.profesional', 'profesional')
      .leftJoinAndSelect('profesional.usuario', 'usuario_prof')
      .leftJoinAndSelect('turno.consultorio', 'consultorio');

    if (fecha) {
      qb.andWhere('CAST(turno.fecha_inicio AS date) = CAST(:fecha AS date)', { fecha });
    }
    if (desde && hasta) {
      const d = typeof desde === 'string' ? desde.split('T')[0] : desde;
      const h = typeof hasta === 'string' ? hasta.split('T')[0] : hasta;
      qb.andWhere('CAST(turno.fecha_inicio AS date) >= CAST(:desde AS date)', { desde: d });
      qb.andWhere('CAST(turno.fecha_inicio AS date) <= CAST(:hasta AS date)', { hasta: h });
    } else if (desde) {
      const d = typeof desde === 'string' ? desde.split('T')[0] : desde;
      qb.andWhere('CAST(turno.fecha_inicio AS date) >= CAST(:desde AS date)', { desde: d });
    } else if (hasta) {
      const h = typeof hasta === 'string' ? hasta.split('T')[0] : hasta;
      qb.andWhere('CAST(turno.fecha_inicio AS date) <= CAST(:hasta AS date)', { hasta: h });
    }
    if (profesionalId) {
      qb.andWhere('turno.profesional_id = :profesionalId', { profesionalId });
    }
    if (consultorioId) {
      qb.andWhere('turno.consultorio_id = :consultorioId', { consultorioId });
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
