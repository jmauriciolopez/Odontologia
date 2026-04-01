import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultorio } from './entities/consultorio.entity';
import { ConsultoriosService } from './consultorios.service';
import { ConsultoriosController } from './consultorios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Consultorio])],
  controllers: [ConsultoriosController],
  providers: [ConsultoriosService],
  exports: [ConsultoriosService, TypeOrmModule],
})
export class ConsultoriosModule {}
