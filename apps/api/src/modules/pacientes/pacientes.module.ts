import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { FichaClinica } from '../fichas-clinicas/entities/ficha-clinica.entity';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, FichaClinica])],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService, TypeOrmModule],
})
export class PacientesModule {}
