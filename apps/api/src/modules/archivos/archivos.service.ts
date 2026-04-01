import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentoAdjunto } from './entities/documento-adjunto.entity.ts';
import { Radiografia } from './entities/radiografia.entity.ts';
import { LocalStorageService } from './storage/local-storage.service.ts';
import { StorageFile } from './storage/storage.interface.ts';

@Injectable()
export class ArchivosService {
  private readonly logger = new Logger(ArchivosService.name);

  constructor(
    @InjectRepository(DocumentoAdjunto)
    private readonly documentoRepository: Repository<DocumentoAdjunto>,
    @InjectRepository(Radiografia)
    private readonly radiografiaRepository: Repository<Radiografia>,
    private readonly storageService: LocalStorageService,
  ) {}

  async saveDocumento(
    file: StorageFile,
    pacienteId: string,
    uploadedById: string,
  ): Promise<DocumentoAdjunto> {
    const filePath = await this.storageService.save(file, `pacientes/${pacienteId}/docs`);

    const documento = this.documentoRepository.create({
      pacienteId,
      nombreArchivo: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      path: filePath,
      uploadedById,
    });

    return await this.documentoRepository.save(documento);
  }

  async saveRadiografia(
    file: StorageFile,
    pacienteId: string,
    tipo: string,
    fechaToma?: string,
  ): Promise<Radiografia> {
    const filePath = await this.storageService.save(file, `pacientes/${pacienteId}/rayos`);

    const radiografia = this.radiografiaRepository.create({
      pacienteId,
      nombreArchivo: file.originalname,
      path: filePath,
      tipo,
      fechaToma: fechaToma ? new Date(fechaToma) : new Date(),
    });

    return await this.radiografiaRepository.save(radiografia);
  }

  async findByPaciente(pacienteId: string) {
    const documentos = await this.documentoRepository.find({ where: { pacienteId } });
    const radiografias = await this.radiografiaRepository.find({ where: { pacienteId } });

    return {
      documentos: documentos.map((d) => ({ ...d, url: this.storageService.getUrl(d.path) })),
      radiografias: radiografias.map((r) => ({ ...r, url: this.storageService.getUrl(r.path) })),
    };
  }

  async deleteDocumento(id: string): Promise<void> {
    const doc = await this.documentoRepository.findOne({ where: { id } });
    if (doc) {
      await this.storageService.delete(doc.path);
      await this.documentoRepository.remove(doc);
    }
  }
}
