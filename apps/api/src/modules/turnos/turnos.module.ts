import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity.ts';
import { TurnosService } from './turnos.service.ts';
import { TurnosController } from './turnos.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Turno])],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService, TypeOrmModule],
})
export class TurnosModule {}
