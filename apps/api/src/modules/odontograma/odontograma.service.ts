import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PiezaDental } from './entities/pieza-dental.entity';
import { ProcedimientoPieza } from './entities/procedimiento-pieza.entity';
import { UpdatePiezaDto, AddProcedimientoDto } from './dto/odontograma.dto';

@Injectable()
export class OdontogramaService {
  constructor(
    @InjectRepository(PiezaDental)
    private readonly piezaRepository: Repository<PiezaDental>,
    @InjectRepository(ProcedimientoPieza)
    private readonly procedimientoRepository: Repository<ProcedimientoPieza>,
  ) {}

  async initializeOdontograma(fichaId: string): Promise<PiezaDental[]> {
    const existing = await this.piezaRepository.find({ where: { fichaId } });
    if (existing.length > 0) return existing;

    const adultPositions = [
      11, 12, 13, 14, 15, 16, 17, 18,
      21, 22, 23, 24, 25, 26, 27, 28,
      31, 32, 33, 34, 35, 36, 37, 38,
      41, 42, 43, 44, 45, 46, 47, 48
    ];

    const piezas = adultPositions.map(pos => this.piezaRepository.create({
      fichaId,
      posicion: pos,
      caras: {
        vestibular: 'sano',
        lingual: 'sano',
        oclusal: 'sano',
        distal: 'sano',
        mesial: 'sano'
      }
    }));

    return await this.piezaRepository.save(piezas);
  }

  async getOdontograma(fichaId: string): Promise<PiezaDental[]> {
    const piezas = await this.piezaRepository.find({
      where: { fichaId },
      relations: ['procedimientos'],
      order: { posicion: 'ASC' }
    });

    if (piezas.length === 0) {
      return await this.initializeOdontograma(fichaId);
    }

    return piezas;
  }

  async updatePieza(dto: UpdatePiezaDto): Promise<PiezaDental> {
    const pieza = await this.piezaRepository.findOne({ where: { id: dto.piezaId } });
    if (!pieza) throw new NotFoundException('Pieza no encontrada');

    if (dto.caras) {
      pieza.caras = { ...pieza.caras, ...dto.caras };
    }

    return await this.piezaRepository.save(pieza);
  }

  async addProcedimiento(dto: AddProcedimientoDto): Promise<ProcedimientoPieza> {
    const pieza = await this.piezaRepository.findOne({ where: { id: dto.piezaId } });
    if (!pieza) throw new NotFoundException('Pieza no encontrada');

    const procedimiento = this.procedimientoRepository.create(dto);
    return await this.procedimientoRepository.save(procedimiento);
  }
}
