import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presupuesto } from './entities/presupuesto.entity';
import { PresupuestoItem } from './entities/presupuesto-item.entity';
import { Pago } from './entities/pago.entity';
import { PresupuestosService } from './presupuestos.service';
import { PresupuestosController } from './presupuestos.controller';

import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Presupuesto, PresupuestoItem, Pago]),
    ReportsModule,
  ],
  controllers: [PresupuestosController],
  providers: [PresupuestosService],
  exports: [PresupuestosService, TypeOrmModule],
})
export class PresupuestosModule {}
