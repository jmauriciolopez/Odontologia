import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObraSocial } from './entities/obra-social.entity';
import { ObraSocialPrestacion } from './entities/obra-social-prestacion.entity';
import { CreateObraSocialDto, UpdateObraSocialDto, BulkUpsertPreciosDto } from './dto/obras-sociales.dto';

@Injectable()
export class ObrasSocialesService {
  constructor(
    @InjectRepository(ObraSocial)
    private readonly obraSocialRepo: Repository<ObraSocial>,
    @InjectRepository(ObraSocialPrestacion)
    private readonly ospRepo: Repository<ObraSocialPrestacion>,
  ) {}

  findAll(): Promise<ObraSocial[]> {
    return this.obraSocialRepo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: string): Promise<ObraSocial> {
    const os = await this.obraSocialRepo.findOne({
      where: { id },
      relations: ['prestaciones', 'prestaciones.prestacion'],
    });
    if (!os) throw new NotFoundException(`Obra social ${id} no encontrada`);
    return os;
  }

  async create(dto: CreateObraSocialDto): Promise<ObraSocial> {
    const os = this.obraSocialRepo.create(dto);
    return this.obraSocialRepo.save(os);
  }

  async update(id: string, dto: UpdateObraSocialDto): Promise<ObraSocial> {
    const os = await this.findOne(id);
    Object.assign(os, dto);
    return this.obraSocialRepo.save(os);
  }

  async remove(id: string): Promise<void> {
    const os = await this.findOne(id);
    await this.obraSocialRepo.remove(os);
  }

  async getPrestaciones(obraSocialId: string): Promise<ObraSocialPrestacion[]> {
    await this.findOne(obraSocialId); // validates existence
    return this.ospRepo.find({
      where: { obraSocialId },
      relations: ['prestacion'],
      order: { prestacion: { codigo: 'ASC' } } as any,
    });
  }

  async upsertPrecios(obraSocialId: string, dto: BulkUpsertPreciosDto): Promise<ObraSocialPrestacion[]> {
    await this.findOne(obraSocialId);

    for (const item of dto.precios) {
      const existing = await this.ospRepo.findOne({
        where: { obraSocialId, prestacionId: item.prestacionId },
      });
      if (existing) {
        existing.precio = item.precio;
        await this.ospRepo.save(existing);
      } else {
        await this.ospRepo.save(
          this.ospRepo.create({ obraSocialId, prestacionId: item.prestacionId, precio: item.precio }),
        );
      }
    }

    return this.getPrestaciones(obraSocialId);
  }

  async deletePrecio(obraSocialId: string, prestacionId: string): Promise<void> {
    await this.ospRepo.delete({ obraSocialId, prestacionId });
  }
}
