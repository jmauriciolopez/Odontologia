import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presupuesto } from './entities/presupuesto.entity';
import { PresupuestoItem } from './entities/presupuesto-item.entity';
import { Pago } from './entities/pago.entity';
import { CreatePresupuestoDto, RegisterPagoDto } from './dto/presupuesto.dto';

@Injectable()
export class PresupuestosService {
  constructor(
    @InjectRepository(Presupuesto)
    private readonly presupuestoRepository: Repository<Presupuesto>,
    @InjectRepository(PresupuestoItem)
    private readonly itemRepository: Repository<PresupuestoItem>,
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
  ) {}

  async create(dto: CreatePresupuestoDto): Promise<Presupuesto> {
    const { items, ...presupuestoData } = dto;

    let total = 0;
    const itemEntities = items.map(item => {
      const subtotal = (Number(item.precioUnitario) * Number(item.cantidad)) - Number(item.descuento || 0);
      total += subtotal;
      return this.itemRepository.create({
        ...item,
        descuento: Number(item.descuento || 0),
        subtotal
      });
    });

    const presupuesto = this.presupuestoRepository.create({
      ...presupuestoData,
      total,
      totalPagado: 0,
      estado: 'pendiente'
    });

    const savedPresupuesto = await this.presupuestoRepository.save(presupuesto);

    itemEntities.forEach(item => item.presupuestoId = savedPresupuesto.id);
    await this.itemRepository.save(itemEntities);

    return await this.findOne(savedPresupuesto.id);
  }

  async findAll(): Promise<Presupuesto[]> {
    return await this.presupuestoRepository.find({
      relations: ['paciente', 'items'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByPaciente(pacienteId: string): Promise<Presupuesto[]> {
    return await this.presupuestoRepository.find({
      where: { pacienteId },
      relations: ['items', 'pagos'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Presupuesto> {
    const presupuesto = await this.presupuestoRepository.findOne({
      where: { id },
      relations: ['items', 'pagos', 'paciente'],
    });

    if (!presupuesto) {
      throw new NotFoundException(`Presupuesto ${id} no encontrado`);
    }

    return presupuesto;
  }

  async registerPago(dto: RegisterPagoDto): Promise<Pago> {
    const presupuesto = await this.findOne(dto.presupuestoId);

    // Recalculate from actual pagos to avoid stale cache
    const pagosExistentes = await this.pagoRepository.find({ where: { presupuestoId: dto.presupuestoId } });
    const totalYaPagado = pagosExistentes.reduce((sum, p) => sum + Number(p.monto), 0);
    const nuevoTotalPagado = totalYaPagado + Number(dto.monto);

    if (nuevoTotalPagado > Number(presupuesto.total)) {
      throw new BadRequestException(
        `El monto supera el saldo pendiente. Pendiente: ${Number(presupuesto.total) - totalYaPagado}`
      );
    }

    const pago = this.pagoRepository.create(dto);
    const savedPago = await this.pagoRepository.save(pago);

    presupuesto.totalPagado = nuevoTotalPagado;
    presupuesto.estado = nuevoTotalPagado >= Number(presupuesto.total) ? 'pagado' : 'pagado_parcial';
    await this.presupuestoRepository.save(presupuesto);

    return savedPago;
  }

  async iniciarTratamiento(id: string): Promise<Presupuesto> {
    const presupuesto = await this.findOne(id);

    if (presupuesto.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden iniciar tratamientos de presupuestos pendientes');
    }

    presupuesto.estado = 'iniciado';
    return await this.presupuestoRepository.save(presupuesto);
  }

  async findPagosByPresupuesto(presupuestoId: string): Promise<Pago[]> {
    return await this.pagoRepository.find({
      where: { presupuestoId },
      order: { fechaPago: 'DESC' }
    });
  }
}
