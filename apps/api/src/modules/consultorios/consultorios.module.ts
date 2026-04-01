import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultorio } from './entities/consultorio.entity.ts';
import { ConsultoriosService } from './consultorios.service.ts';
import { ConsultoriosController } from './consultorios.controller.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Consultorio])],
  controllers: [ConsultoriosController],
  providers: [ConsultoriosService],
  exports: [ConsultoriosService, TypeOrmModule],
})
export class ConsultoriosModule {}
