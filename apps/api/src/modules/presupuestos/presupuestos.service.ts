import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Presupuesto } from './entities/presupuesto.entity';
import { PresupuestoItem } from './entities/presupuesto-item.entity';
import { Pago } from './entities/pago.entity';
import { CreatePresupuestoDto, RegisterPagoDto } from './dto/presupuesto.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import { TenantHelper } from '../../common/utils/tenant-helper';
import { ClsService } from 'nestjs-cls';

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
    private readonly cls: ClsService,
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

  async findAll(pagination: PaginationDto = {}): Promise<PaginatedResponse<Presupuesto>> {
    const { page = 1, limit = 10 } = pagination;
    const [data, total] = await this.presupuestoRepository.findAndCount(
      TenantHelper.withTenant(this.cls, {
        relations: ['paciente', 'items'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      })
    );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByPaciente(pacienteId: string): Promise<Presupuesto[]> {
    return await this.presupuestoRepository.find(
      TenantHelper.withTenant(this.cls, {
        where: { pacienteId },
        relations: ['paciente', 'items', 'pagos'],
        order: { createdAt: 'DESC' }
      })
    );
  }

  async findOne(id: string): Promise<Presupuesto> {
    const presupuesto = await this.presupuestoRepository.findOne(
      TenantHelper.withTenant(this.cls, {
        where: { id },
        relations: ['items', 'pagos', 'paciente'],
      })
    );

    if (!presupuesto) {
      throw new NotFoundException(`Presupuesto ${id} no encontrado`);
    }

    return presupuesto;
  }

  async registerPago(dto: RegisterPagoDto): Promise<Pago> {
    return await this.dataSource.transaction(async (manager) => {
      const presupuesto = await manager.findOne(Presupuesto, 
        TenantHelper.withTenant(this.cls, {
          where: { id: dto.presupuestoId },
        })
      );
      if (!presupuesto) {
        throw new NotFoundException(`Presupuesto ${dto.presupuestoId} no encontrado`);
      }

      // Calcular desde pagos reales dentro de la transacción
      const qb = manager.createQueryBuilder(Pago, 'p')
        .select('COALESCE(SUM(p.monto), 0)', 'sum')
        .where('p.presupuesto_id = :id', { id: dto.presupuestoId });
      
      TenantHelper.applyFilter(qb, this.cls, 'p');

      const { sum } = await qb.getRawOne();

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
          clinicaId: this.cls.get('clinicaId'), // Explicitly set if needed, although Subscriber should handle it
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
    return await this.pagoRepository.find(
      TenantHelper.withTenant(this.cls, {
        where: { presupuestoId },
        order: { fechaPago: 'DESC' }
      })
    );
  }
}
