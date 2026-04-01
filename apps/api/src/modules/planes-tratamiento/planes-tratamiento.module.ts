import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanTratamiento } from './entities/plan-tratamiento.entity';
import { PlanTratamientoItem } from './entities/plan-tratamiento-item.entity';
import { PlanesTratamientoService } from './planes-tratamiento.service';
import { PlanesTratamientoController } from './planes-tratamiento.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlanTratamiento, PlanTratamientoItem])],
  controllers: [PlanesTratamientoController],
  providers: [PlanesTratamientoService],
  exports: [PlanesTratamientoService],
})
export class PlanesTratamientoModule {}
