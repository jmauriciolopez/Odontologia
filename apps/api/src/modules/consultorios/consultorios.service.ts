import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultorio } from './entities/consultorio.entity';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';
import { TenantHelper } from '../../common/utils/tenant-helper';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ConsultoriosService {
  constructor(
    @InjectRepository(Consultorio)
    private readonly consultoriosRepository: Repository<Consultorio>,
    private readonly cls: ClsService,
  ) {}

  async create(createConsultorioDto: CreateConsultorioDto): Promise<Consultorio> {
    const consultorio = this.consultoriosRepository.create(createConsultorioDto);
    return await this.consultoriosRepository.save(consultorio);
  }

  async findAll(): Promise<Consultorio[]> {
    return await this.consultoriosRepository.find(TenantHelper.withTenant(this.cls));
  }

  async findOne(id: string): Promise<Consultorio> {
    const consultorio = await this.consultoriosRepository.findOne(
      TenantHelper.withTenant(this.cls, { where: { id } })
    );
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

  async validarDisponibilidadHoraria(id: string, inicio: Date, fin: Date): Promise<void> {
    const consultorio = await this.findOne(id);

    const DIA_NOMBRE: Record<number, string> = {
      0: 'Domingo',
      1: 'Lunes',
      2: 'Martes',
      3: 'Miércoles',
      4: 'Jueves',
      5: 'Viernes',
      6: 'Sábado',
    };

    const diaNombre = DIA_NOMBRE[inicio.getUTCDay()];
    if (consultorio.diasAtencion && consultorio.diasAtencion.length > 0) {
      const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const atiende = consultorio.diasAtencion.some(d => normalize(d) === normalize(diaNombre));
      if (!atiende) {
        throw new BadRequestException(
          `El consultorio "${consultorio.nombre}" no atiende los ${diaNombre}`
        );
      }
    }

    if (consultorio.horario?.trim()) {
      const toMin = (hhmm: string) => {
        const [h, m] = hhmm.trim().split(':').map(Number);
        return h * 60 + m;
      };
      const inicioMin = inicio.getUTCHours() * 60 + inicio.getUTCMinutes();
      const finMin    = fin.getUTCHours()    * 60 + fin.getUTCMinutes();

      const rangos = consultorio.horario.split(',').map(r => r.trim());
      const dentroDeAlgunRango = rangos.some(rango => {
        const partes = rango.split('-').map(p => p.trim());
        if (partes.length !== 2) return true;
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
}
