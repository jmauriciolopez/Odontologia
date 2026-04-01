import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PiezaDental } from './entities/pieza-dental.entity';
import { ProcedimientoPieza } from './entities/procedimiento-pieza.entity';
import { OdontogramaService } from './odontograma.service';
import { OdontogramaController } from './odontograma.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PiezaDental, ProcedimientoPieza])],
  controllers: [OdontogramaController],
  providers: [OdontogramaService],
  exports: [OdontogramaService],
})
export class OdontogramaModule {}
