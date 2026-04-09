import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichaClinica } from './entities/ficha-clinica.entity';
import { Antecedente } from './entities/antecedente.entity';
import { EvolucionClinica } from './entities/evolucion-clinica.entity';
import { MedicionPeriodontal } from './entities/medicion-periodontal.entity';
import { FichasClinicasService } from './fichas-clinicas.service';
import { FichasClinicasController } from './fichas-clinicas.controller';
import { Profesional } from '../profesionales/entities/profesional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FichaClinica, Antecedente, EvolucionClinica, MedicionPeriodontal, Profesional])],
  controllers: [FichasClinicasController],
  providers: [FichasClinicasService],
  exports: [FichasClinicasService],
})
export class FichasClinicasModule {}
