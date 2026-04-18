import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { FichaClinica } from '../fichas-clinicas/entities/ficha-clinica.entity';
import { ObraSocial } from '../obras-sociales/entities/obra-social.entity';
import { ObraSocialPrestacion } from '../obras-sociales/entities/obra-social-prestacion.entity';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, FichaClinica, ObraSocial, ObraSocialPrestacion])],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService, TypeOrmModule],
})
export class PacientesModule {}
