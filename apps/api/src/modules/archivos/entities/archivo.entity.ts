import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum ArchivoCategoria {
  DOCUMENTO = 'DOCUMENTO',
  RADIOGRAFIA = 'RADIOGRAFIA',
  ESTUDIO = 'ESTUDIO',
  OTROS = 'OTROS',
}

@Entity('archivos')
export class Archivo extends BaseEntity {
  @Column({ name: 'paciente_id' })
  pacienteId!: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente!: Paciente;

  @Column()
  nombre!: string;

  @Column({ name: 'mime_type', nullable: true })
  mimeType?: string;

  @Column({ name: 'size_bytes', type: 'bigint', nullable: true })
  sizeBytes?: number;

  @Column({ type: 'text' })
  path!: string;

  @Column({
    type: 'enum',
    enum: ArchivoCategoria,
    default: ArchivoCategoria.DOCUMENTO,
  })
  categoria!: ArchivoCategoria;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedById?: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy?: Usuario;
}
