import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Presupuesto } from '../presupuestos/entities/presupuesto.entity';
import { Pago } from '../presupuestos/entities/pago.entity';
import { PlanTratamientoItem } from '../planes-tratamiento/entities/plan-tratamiento-item.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    @InjectRepository(Presupuesto)
    private readonly presupuestoRepository: Repository<Presupuesto>,
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(PlanTratamientoItem)
    private readonly planTratamientoItemRepository: Repository<PlanTratamientoItem>,
  ) {}

  async getHistoricalStats(from: string, to: string) {
    const start = new Date(from);
    const end = new Date(to);

    const [ingresos, tratamientos] = await Promise.all([
      this.pagoRepository.createQueryBuilder('pago')
        .select("TO_CHAR(pago.fechaPago, 'YYYY-MM')", 'month')
        .addSelect('SUM(pago.monto)', 'total')
        .where('pago.fechaPago BETWEEN :start AND :end', { start, end })
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany(),
      this.planTratamientoItemRepository.createQueryBuilder('item')
        .select("TO_CHAR(item.createdAt, 'YYYY-MM')", 'month')
        .addSelect('COUNT(*)', 'total')
        .where('item.createdAt BETWEEN :start AND :end', { start, end })
        .andWhere("item.estado = 'realizado'")
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany()
    ]);

    const months = new Set([...ingresos.map(i => i.month), ...tratamientos.map(t => t.month)]);
    const sortedMonths = Array.from(months).sort();

    return sortedMonths.map(month => ({
      month,
      ingresos: parseFloat(ingresos.find(i => i.month === month)?.total || '0'),
      tratamientos: parseInt(tratamientos.find(t => t.month === month)?.total || '0')
    }));
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      totalPacientes,
      turnosHoy,
      presupuestosMes,
      pagosMes,
      proximosTurnos
    ] = await Promise.all([
      this.pacienteRepository.count(),
      this.turnoRepository.count({
        where: {
          fechaInicio: Between(today, tomorrow),
          estado: 'confirmado'
        }
      }),
      this.presupuestoRepository.createQueryBuilder('p')
        .where('p.createdAt >= :start AND p.createdAt <= :end', { start: firstDayOfMonth, end: lastDayOfMonth })
        .select('SUM(p.total)', 'total')
        .getRawOne(),
      this.pagoRepository.createQueryBuilder('pago')
        .where('pago.fechaPago >= :start AND pago.fechaPago <= :end', { start: firstDayOfMonth, end: lastDayOfMonth })
        .select('SUM(pago.monto)', 'total')
        .getRawOne(),
      this.turnoRepository.find({
        where: {
          fechaInicio: MoreThanOrEqual(new Date()),
          estado: 'confirmado'
        },
        relations: ['paciente', 'consultorio', 'profesional'],
        order: { fechaInicio: 'ASC' },
        take: 5
      })
    ]);

    return {
      totalPacientes,
      turnosHoy,
      facturacionProyectada: parseFloat(presupuestosMes?.total || '0'),
      facturacionReal: parseFloat(pagosMes?.total || '0'),
      proximosTurnos
    };
  }

  async getCobranzaReport(from: string, to: string) {
    const start = new Date(from);
    const end = new Date(to);

    return this.pagoRepository.find({
      where: {
        fechaPago: Between(start, end)
      },
      relations: ['presupuesto', 'presupuesto.paciente'],
      order: { fechaPago: 'DESC' }
    });
  }

  async getNuevosPacientesReport(from: string, to: string) {
    const start = new Date(from);
    const end = new Date(to);

    return this.pacienteRepository.find({
      where: {
        createdAt: Between(start, end)
      },
      order: { createdAt: 'DESC' }
    });
  }
}
