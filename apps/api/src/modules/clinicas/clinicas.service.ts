import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinica } from './entities/clinica.entity';
import { addDays } from 'date-fns';

@Injectable()
export class ClinicasService {
  constructor(
    @InjectRepository(Clinica)
    private readonly clinicaRepository: Repository<Clinica>,
  ) {}

  async create(nombre: string) {
    const slug = nombre
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = await this.clinicaRepository.findOne({ where: { slug } });
    if (existing) {
      // Si el slug ya existe, le agregamos un hash corto o número
      const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 5)}`;
      return this.saveClinica(nombre, uniqueSlug);
    }

    return this.saveClinica(nombre, slug);
  }

  private async saveClinica(nombre: string, slug: string) {
    const clinica = this.clinicaRepository.create({
      nombre,
      slug,
      trialExpiresAt: addDays(new Date(), 30), // 30 días de prueba
      maxPatients: 100,
    });

    return this.clinicaRepository.save(clinica);
  }

  async findById(id: string) {
    return this.clinicaRepository.findOne({ where: { id } });
  }
}
