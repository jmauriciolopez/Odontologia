import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesional } from './entities/profesional.entity.ts';
import { ProfesionalesService } from './profesionales.service.ts';
import { ProfesionalesController } from './profesionales.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Profesional])],
  controllers: [ProfesionalesController],
  providers: [ProfesionalesService],
  exports: [ProfesionalesService, TypeOrmModule],
})
export class ProfesionalesModule {}
