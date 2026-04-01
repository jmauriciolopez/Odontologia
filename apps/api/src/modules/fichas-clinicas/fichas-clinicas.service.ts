import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FichaClinica } from './entities/ficha-clinica.entity';
import { Antecedente } from './entities/antecedente.entity';
import { EvolucionClinica } from './entities/evolucion-clinica.entity';
import { CreateFichaClinicaDto } from './dto/create-ficha-clinica.dto';
import { CreateAntecedenteDto } from './dto/create-antecedente.dto';
import { CreateEvolucionClinicaDto } from './dto/create-evolucion-clinica.dto';

@Injectable()
export class FichasClinicasService {
  constructor(
    @InjectRepository(FichaClinica)
    private readonly fichaRepository: Repository<FichaClinica>,
    @InjectRepository(Antecedente)
    private readonly antecedenteRepository: Repository<Antecedente>,
    @InjectRepository(EvolucionClinica)
    private readonly evolucionRepository: Repository<EvolucionClinica>,
  ) {}

  async createFicha(dto: CreateFichaClinicaDto): Promise<FichaClinica> {
    const ficha = this.fichaRepository.create(dto);
    return await this.fichaRepository.save(ficha);
  }

  async findByPaciente(pacienteId: string): Promise<FichaClinica> {
    const ficha = await this.fichaRepository.findOne({
      where: { pacienteId },
      relations: ['antecedentes', 'evoluciones'],
    });

    if (!ficha) {
      throw new NotFoundException(`Ficha clínica para paciente ${pacienteId} no encontrada`);
    }

    return ficha;
  }

  async addAntecedente(dto: CreateAntecedenteDto): Promise<Antecedente> {
    const antecedente = this.antecedenteRepository.create(dto);
    return await this.antecedenteRepository.save(antecedente);
  }

  async addEvolucion(dto: CreateEvolucionClinicaDto): Promise<EvolucionClinica> {
    const evolucion = this.evolucionRepository.create(dto);
    return await this.evolucionRepository.save(evolucion);
  }
}
