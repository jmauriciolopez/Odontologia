import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface HorarioDia {
  activo: boolean;
  desde: string; // "08:00"
  hasta: string; // "20:00"
}

export interface HorarioOperativo {
  lunes:     HorarioDia;
  martes:    HorarioDia;
  miercoles: HorarioDia;
  jueves:    HorarioDia;
  viernes:   HorarioDia;
  sabado:    HorarioDia;
  domingo:   HorarioDia;
}

@Entity('configuracion_clinica')
export class ConfiguracionClinica {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'FDI' })
  sistemaDental!: string;

  @Column({ type: 'jsonb', nullable: true })
  coloresEstados?: {
    sano: string;
    caries: string;
    restauracion: string;
    temporal: string;
    perdida: string;
    ausente: string;
    protesis: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  horarioOperativo?: HorarioOperativo;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
