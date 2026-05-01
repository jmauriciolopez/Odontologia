import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinica } from './entities/clinica.entity';
import { ClinicasService } from './clinicas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Clinica])],
  providers: [ClinicasService],
  exports: [ClinicasService, TypeOrmModule],
})
export class ClinicasModule {}
