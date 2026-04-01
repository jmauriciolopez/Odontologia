import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.ts';
import { Paciente } from '../../pacientes/entities/paciente.entity.ts';
import { Usuario } from '../../usuarios/entities/usuario.entity.ts';

@Entity('documentos_adjuntos')
export class DocumentoAdjunto extends BaseEntity {
  @Column({ name: 'paciente_id' })
  pacienteId: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'nombre_archivo' })
  nombreArchivo: string;

  @Column({ name: 'mime_type', nullable: true })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'bigint', nullable: true })
  sizeBytes: number;

  @Column({ type: 'text' })
  path: string;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedById: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: Usuario;
}
