import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Presupuesto } from '../presupuestos/entities/presupuesto.entity';
import { Pago } from '../presupuestos/entities/pago.entity';
import { PlanTratamientoItem } from '../planes-tratamiento/entities/plan-tratamiento-item.entity';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, Turno, Presupuesto, Pago, PlanTratamientoItem]),
    ReportsModule,
    CacheModule.register({
      ttl: 600, // 10 minutes by default
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
