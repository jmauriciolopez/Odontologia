import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoAdjunto } from './entities/documento-adjunto.entity.ts';
import { Radiografia } from './entities/radiografia.entity.ts';
import { ArchivosService } from './archivos.service.ts';
import { ArchivosController } from './archivos.controller.ts';
import { LocalStorageService } from './storage/local-storage.service.ts';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoAdjunto, Radiografia])],
  controllers: [ArchivosController],
  providers: [ArchivosService, LocalStorageService],
  exports: [ArchivosService],
})
export class ArchivosModule {}
