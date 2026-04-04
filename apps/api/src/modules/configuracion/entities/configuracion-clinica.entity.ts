import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('configuracion_clinica')
export class ConfiguracionClinica {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'FDI' })
  sistemaDental: string; // FDI, Universal, Palmer

  @Column({ type: 'jsonb', nullable: true })
  coloresEstados: {
    sano: string;
    caries: string;
    restauracion: string;
    perdida: string;
    ausente: string;
    protesis: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
