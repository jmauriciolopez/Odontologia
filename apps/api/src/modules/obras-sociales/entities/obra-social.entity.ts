import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObraSocialPrestacion } from './obra-social-prestacion.entity';

@Entity('obras_sociales')
export class ObraSocial {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  codigo?: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ default: true })
  activo!: boolean;

  @OneToMany(() => ObraSocialPrestacion, (osp) => osp.obraSocial, { cascade: true })
  prestaciones!: ObraSocialPrestacion[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
