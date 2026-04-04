import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfiguracionClinica } from './entities/configuracion-clinica.entity';
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

  async getConfig() {
    let config = await this.configRepository.findOne({ where: { isActive: true } });
    if (!config) {
      config = await this.configRepository.save({
        sistemaDental: 'FDI',
        coloresEstados: {
          sano: '#10b981', // emerald-500
          caries: '#ef4444', // red-500
          restauracion: '#3b82f6', // blue-500
          perdida: '#64748b', // slate-500
          ausente: '#94a3b8', // slate-400
          protesis: '#8b5cf6', // violet-500
        },
      });
    }
    return config;
  }

  async updateConfig(data: UpdateConfiguracionDto) {
    const config = await this.getConfig();
    return this.configRepository.save({ ...config, ...data });
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
    return this.prestacionRepository.save({ ...p, ...data });
  }

  async deletePrestacion(id: string) {
    return this.prestacionRepository.delete(id);
  }
}
