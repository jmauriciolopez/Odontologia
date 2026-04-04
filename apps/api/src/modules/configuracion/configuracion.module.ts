import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionClinica } from './entities/configuracion-clinica.entity';
import { Prestacion } from './entities/prestacion.entity';
import { ConfiguracionService } from './configuracion.service';
import { ConfiguracionController } from './configuracion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfiguracionClinica, Prestacion]),
  ],
  providers: [ConfiguracionService],
  controllers: [ConfiguracionController],
  exports: [ConfiguracionService],
})
export class ConfiguracionModule {}
