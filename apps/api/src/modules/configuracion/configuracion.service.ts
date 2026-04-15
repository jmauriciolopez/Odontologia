import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionClinica, HorarioOperativo } from './entities/configuracion-clinica.entity';
import { Prestacion } from './entities/prestacion.entity';
import { UpdateConfiguracionDto, CreatePrestacionDto, UpdatePrestacionDto } from './dto/configuracion.dto';

@Injectable()
export class ConfiguracionService {
  constructor(
    @InjectRepository(ConfiguracionClinica)
    private configRepository: Repository<ConfiguracionClinica>,
    @InjectRepository(Prestacion)
    private prestacionRepository: Repository<Prestacion>,
  ) {}

  /** Convención FDI: patología (rojo), realizado (azul), temporal/preventivo (verde). */
  private readonly DEFAULT_COLORES = {
    sano: '#f1f5f9',
    caries: '#FF0000',
    restauracion: '#0000FF',
    temporal: '#008000',
    perdida: '#64748b',
    ausente: '#94a3b8',
    protesis: '#6b7280',
  };

  private mergeColores(raw: Record<string, string> | null | undefined) {
    return { ...this.DEFAULT_COLORES, ...(raw || {}) };
  }

  private readonly DEFAULT_HORARIO: HorarioOperativo = {
    lunes:     { activo: true,  desde: '08:00', hasta: '20:00' },
    martes:    { activo: true,  desde: '08:00', hasta: '20:00' },
    miercoles: { activo: true,  desde: '08:00', hasta: '20:00' },
    jueves:    { activo: true,  desde: '08:00', hasta: '20:00' },
    viernes:   { activo: true,  desde: '08:00', hasta: '20:00' },
    sabado:    { activo: true,  desde: '08:00', hasta: '14:00' },
    domingo:   { activo: false, desde: '08:00', hasta: '14:00' },
  };

  async getConfig() {
    let config = await this.configRepository.findOne({ where: { isActive: true } });
    if (!config) {
      config = await this.configRepository.save({
        sistemaDental: 'FDI',
        coloresEstados: this.DEFAULT_COLORES,
        horarioOperativo: this.DEFAULT_HORARIO,
      });
    }
    if (!config.coloresEstados) {
      config.coloresEstados = this.DEFAULT_COLORES as any;
      config = await this.configRepository.save(config);
    }
    if (!config.horarioOperativo) {
      config.horarioOperativo = this.DEFAULT_HORARIO as any;
      config = await this.configRepository.save(config);
    }
    return { ...config, coloresEstados: this.mergeColores(config.coloresEstados) };
  }

  async updateConfig(data: UpdateConfiguracionDto) {
    let base = await this.configRepository.findOne({ where: { isActive: true } });
    if (!base) {
      await this.getConfig();
      base = await this.configRepository.findOne({ where: { isActive: true } });
    }
    if (!base) throw new NotFoundException('Configuración no encontrada');
    const coloresEstados = data.coloresEstados
      ? this.mergeColores({ ...(base.coloresEstados || {}), ...data.coloresEstados })
      : base.coloresEstados;
    return this.configRepository.save({
      ...base,
      ...data,
      ...(data.coloresEstados ? { coloresEstados } : {}),
    });
  }

  async getPrestaciones() {
    return this.prestacionRepository.find({ order: { codigo: 'ASC' } });
  }

  async createPrestacion(data: CreatePrestacionDto) {
    return this.prestacionRepository.save(data);
  }

  async updatePrestacion(id: string, data: UpdatePrestacionDto) {
    const p = await this.prestacionRepository.findOne({ where: { id } });
    if (!p) throw new NotFoundException();
    // Items del sistema: solo se puede editar el honorario
    if (p.esSistema) {
      return this.prestacionRepository.save({ ...p, honorarios: data.honorarios ?? p.honorarios });
    }
    return this.prestacionRepository.save({ ...p, ...data });
  }

  async deletePrestacion(id: string) {
    const p = await this.prestacionRepository.findOne({ where: { id } });
    if (!p) throw new NotFoundException();
    if (p.esSistema) throw new Error('Las prestaciones del sistema no pueden eliminarse');
    return this.prestacionRepository.delete(id);
  }
}
