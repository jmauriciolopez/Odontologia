import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('prestaciones')
export class Prestacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  codigo: string; // Ej: 01.01

  @Column()
  nombre: string; // Ej: Consulta

  @Column({ nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  honorarios: number;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
