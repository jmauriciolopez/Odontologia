import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type OrigenPrestacion = 'NON' | 'CLINICA' | 'CATALOGO';

@Entity('prestaciones')
export class Prestacion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  codigo!: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  categoria?: string;

  @Column({ nullable: true })
  subcategoria?: string;

  @Column({ type: 'varchar', default: 'CLINICA' })
  origen!: OrigenPrestacion;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  honorarios!: number;

  @Column({ default: true })
  activo!: boolean;

  @Column({ name: 'es_sistema', default: false })
  esSistema!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
