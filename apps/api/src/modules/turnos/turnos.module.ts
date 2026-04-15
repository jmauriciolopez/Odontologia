import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { ConfiguracionClinica } from '../configuracion/entities/configuracion-clinica.entity';
import { Consultorio } from '../consultorios/entities/consultorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, ConfiguracionClinica, Consultorio])],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService, TypeOrmModule],
})
export class TurnosModule {}
