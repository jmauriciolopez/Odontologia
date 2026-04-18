import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
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
      relations: ['paciente', 'items', 'pagos'],
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
    return await this.dataSource.transaction(async (manager) => {
      const presupuesto = await manager.findOne(Presupuesto, {
        where: { id: dto.presupuestoId },
      });
      if (!presupuesto) {
        throw new NotFoundException(`Presupuesto ${dto.presupuestoId} no encontrado`);
      }

      // Calcular desde pagos reales dentro de la transacción
      const { sum } = await manager
        .createQueryBuilder(Pago, 'p')
        .select('COALESCE(SUM(p.monto), 0)', 'sum')
        .where('p.presupuesto_id = :id', { id: dto.presupuestoId })
        .getRawOne();

      const totalYaPagado = Number(sum);
      const nuevoTotalPagado = totalYaPagado + Number(dto.monto);

      if (nuevoTotalPagado > Number(presupuesto.total)) {
        throw new BadRequestException(
          `El monto supera el saldo pendiente. Pendiente: ${Number(presupuesto.total) - totalYaPagado}`,
        );
      }

      const result = await manager
        .createQueryBuilder()
        .insert()
        .into(Pago)
        .values({
          presupuestoId: dto.presupuestoId,
          monto: Number(dto.monto),
          metodoPago: dto.metodoPago,
          notas: dto.notas ?? undefined,
        })
        .returning('*')
        .execute();

      await manager.update(Presupuesto, dto.presupuestoId, {
        totalPagado: nuevoTotalPagado,
        estado: nuevoTotalPagado >= Number(presupuesto.total) ? 'pagado' : 'pagado_parcial',
      });

      return result.generatedMaps[0] as Pago;
    });
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
