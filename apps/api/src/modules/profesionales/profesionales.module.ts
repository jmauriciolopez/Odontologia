import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profesional } from './entities/profesional.entity';
import { ProfesionalesService } from './profesionales.service';
import { ProfesionalesController } from './profesionales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profesional])],
  controllers: [ProfesionalesController],
  providers: [ProfesionalesService],
  exports: [ProfesionalesService, TypeOrmModule],
})
export class ProfesionalesModule {}
