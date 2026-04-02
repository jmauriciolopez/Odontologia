import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Presupuesto } from '../presupuestos/entities/presupuesto.entity';
import { Pago } from '../presupuestos/entities/pago.entity';

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
  ) {}

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
        .where('pago.fecha >= :start AND pago.fecha <= :end', { start: firstDayOfMonth, end: lastDayOfMonth })
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
}
