import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export enum PlanClinica {
  TRIAL = 'TRIAL',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

@Entity('clinicas')
export class Clinica {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: 'timestamp with time zone' })
  trialExpiresAt!: Date;

  @Column({ default: 100 })
  maxPatients!: number;

  @Column({
    type: 'enum',
    enum: PlanClinica,
    default: PlanClinica.TRIAL,
  })
  plan!: PlanClinica;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Usuario, (usuario) => usuario.clinica)
  usuarios!: Usuario[];
}
