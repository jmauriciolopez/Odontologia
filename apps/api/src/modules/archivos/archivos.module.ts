import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentoAdjunto } from './entities/documento-adjunto.entity';
import { Radiografia } from './entities/radiografia.entity';
import { ArchivosService } from './archivos.service';
import { ArchivosController } from './archivos.controller';
import { LocalStorageService } from './storage/local-storage.service';
import { S3StorageService } from './storage/s3-storage.service';

const StorageProvider = {
  provide: 'STORAGE_SERVICE',
  useClass: process.env.STORAGE_PROVIDER === 's3' ? S3StorageService : LocalStorageService,
};

@Module({
  imports: [TypeOrmModule.forFeature([DocumentoAdjunto, Radiografia])],
  controllers: [ArchivosController],
  providers: [ArchivosService, StorageProvider],
  exports: [ArchivosService],
})
export class ArchivosModule {}
