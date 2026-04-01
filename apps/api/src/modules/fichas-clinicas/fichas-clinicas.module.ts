import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichaClinica } from './entities/ficha-clinica.entity';
import { Antecedente } from './entities/antecedente.entity';
import { EvolucionClinica } from './entities/evolucion-clinica.entity';
import { FichasClinicasService } from './fichas-clinicas.service';
import { FichasClinicasController } from './fichas-clinicas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FichaClinica, Antecedente, EvolucionClinica])],
  controllers: [FichasClinicasController],
  providers: [FichasClinicasService],
  exports: [FichasClinicasService],
})
export class FichasClinicasModule {}
