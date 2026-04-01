import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultorio } from './entities/consultorio.entity';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';

@Injectable()
export class ConsultoriosService {
  constructor(
    @InjectRepository(Consultorio)
    private readonly consultoriosRepository: Repository<Consultorio>,
  ) {}

  async create(createConsultorioDto: CreateConsultorioDto): Promise<Consultorio> {
    const consultorio = this.consultoriosRepository.create(createConsultorioDto);
    return await this.consultoriosRepository.save(consultorio);
  }

  async findAll(): Promise<Consultorio[]> {
    return await this.consultoriosRepository.find();
  }

  async findOne(id: string): Promise<Consultorio> {
    const consultorio = await this.consultoriosRepository.findOneBy({ id });
    if (!consultorio) {
      throw new NotFoundException(`Consultorio con ID ${id} no encontrado`);
    }
    return consultorio;
  }

  async update(id: string, updateConsultorioDto: UpdateConsultorioDto): Promise<Consultorio> {
    const consultorio = await this.findOne(id);
    this.consultoriosRepository.merge(consultorio, updateConsultorioDto);
    return await this.consultoriosRepository.save(consultorio);
  }

  async remove(id: string): Promise<void> {
    const consultorio = await this.findOne(id);
    await this.consultoriosRepository.remove(consultorio);
  }
}
