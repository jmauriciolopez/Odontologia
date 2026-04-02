import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Presupuesto } from '../presupuestos/entities/presupuesto.entity';
import { Pago } from '../presupuestos/entities/pago.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente, Turno, Presupuesto, Pago]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
