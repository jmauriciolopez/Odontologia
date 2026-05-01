import { Injectable, Logger, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Archivo, ArchivoCategoria } from './entities/archivo.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';
import { IStorageService, StorageFile } from './storage/storage.interface';
import { TenantHelper } from '../../common/utils/tenant-helper';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ArchivosService {
  private readonly logger = new Logger(ArchivosService.name);

  constructor(
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @Inject('STORAGE_SERVICE')
    private readonly storageService: IStorageService,
    private readonly cls: ClsService,
  ) {}

  private async checkPatientOwnership(pacienteId: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne(
      TenantHelper.withTenantOne(this.cls, { where: { id: pacienteId } })
    );
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${pacienteId} no encontrado en su clínica`);
    }
  }

  async saveDocumento(
    file: StorageFile,
    pacienteId: string,
    uploadedById: string,
  ): Promise<Archivo> {
    await this.checkPatientOwnership(pacienteId);
    const filePath = await this.storageService.save(file, `pacientes/${pacienteId}/docs`);

    const archivo = this.archivoRepository.create({
      pacienteId,
      nombre: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      path: filePath,
      uploadedById,
      categoria: ArchivoCategoria.DOCUMENTO,
    });

    return await this.archivoRepository.save(archivo);
  }

  async saveRadiografia(
    file: StorageFile,
    pacienteId: string,
    tipo: string,
    fechaToma?: string,
    uploadedById?: string,
  ): Promise<Archivo> {
    await this.checkPatientOwnership(pacienteId);
    const filePath = await this.storageService.save(file, `pacientes/${pacienteId}/rayos`);

    const archivo = this.archivoRepository.create({
      pacienteId,
      nombre: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      path: filePath,
      categoria: ArchivoCategoria.RADIOGRAFIA,
      uploadedById,
      metadata: {
        tipo,
        fechaToma: fechaToma ? new Date(fechaToma) : new Date(),
      },
    });

    return await this.archivoRepository.save(archivo);
  }

  async findByPaciente(pacienteId: string) {
    const archivos = await this.archivoRepository.find(
      TenantHelper.withTenant<Archivo>(this.cls, {
        where: { pacienteId },
        order: { createdAt: 'DESC' } as any,
      })
    );

    // Separamos por categoría para mantener compatibilidad con el frontend actual si es necesario
    // aunque lo ideal sería devolver una lista unificada
    return {
      documentos: archivos
        .filter((a) => a.categoria !== ArchivoCategoria.RADIOGRAFIA)
        .map((a) => ({ ...a, url: this.storageService.getUrl(a.path) })),
      radiografias: archivos
        .filter((a) => a.categoria === ArchivoCategoria.RADIOGRAFIA)
        .map((a) => ({ ...a, url: this.storageService.getUrl(a.path) })),
      todos: archivos.map((a) => ({ ...a, url: this.storageService.getUrl(a.path) })),
    };
  }

  async deleteDocumento(id: string): Promise<void> {
    const archivo = await this.archivoRepository.findOne(
      TenantHelper.withTenantOne(this.cls, { where: { id } })
    );
    if (archivo) {
      await this.storageService.delete(archivo.path);
      await this.archivoRepository.remove(archivo);
    }
  }
}
