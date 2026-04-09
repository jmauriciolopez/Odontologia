import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObraSocial } from './entities/obra-social.entity';
import { ObraSocialPrestacion } from './entities/obra-social-prestacion.entity';
import { ObrasSocialesService } from './obras-sociales.service';
import { ObrasSocialesController } from './obras-sociales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ObraSocial, ObraSocialPrestacion])],
  providers: [ObrasSocialesService],
  controllers: [ObrasSocialesController],
  exports: [ObrasSocialesService],
})
export class ObrasSocialesModule {}
