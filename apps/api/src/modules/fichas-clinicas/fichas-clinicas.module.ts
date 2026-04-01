import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichaClinica } from './entities/ficha-clinica.entity.ts';
import { Antecedente } from './entities/antecedente.entity.ts';
import { EvolucionClinica } from './entities/evolucion-clinica.entity.ts';
import { FichasClinicasService } from './fichas-clinicas.service.ts';
import { FichasClinicasController } from './fichas-clinicas.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([FichaClinica, Antecedente, EvolucionClinica])],
  controllers: [FichasClinicasController],
  providers: [FichasClinicasService],
  exports: [FichasClinicasService],
})
export class FichasClinicasModule {}
