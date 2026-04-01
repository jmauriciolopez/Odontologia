import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoAdjunto } from './entities/documento-adjunto.entity';
import { Radiografia } from './entities/radiografia.entity';
import { ArchivosService } from './archivos.service';
import { ArchivosController } from './archivos.controller';
import { LocalStorageService } from './storage/local-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoAdjunto, Radiografia])],
  controllers: [ArchivosController],
  providers: [ArchivosService, LocalStorageService],
  exports: [ArchivosService],
})
export class ArchivosModule {}
