import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';
import { ArchivosService } from './archivos.service';
import { ArchivosController } from './archivos.controller';
import { LocalStorageService } from './storage/local-storage.service';
import { S3StorageService } from './storage/s3-storage.service';

const StorageProvider = {
  provide: 'STORAGE_SERVICE',
  useClass: process.env.STORAGE_PROVIDER === 's3' ? S3StorageService : LocalStorageService,
};

@Module({
  imports: [TypeOrmModule.forFeature([Archivo])],
  controllers: [ArchivosController],
  providers: [ArchivosService, StorageProvider],
  exports: [ArchivosService],
})
export class ArchivosModule {}
