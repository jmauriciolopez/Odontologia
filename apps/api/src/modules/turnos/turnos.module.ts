import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { ConfiguracionClinica } from '../configuracion/entities/configuracion-clinica.entity';
import { ConsultoriosModule } from '../consultorios/consultorios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, ConfiguracionClinica]),
    ConsultoriosModule
  ],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService, TypeOrmModule],
})
export class TurnosModule {}
