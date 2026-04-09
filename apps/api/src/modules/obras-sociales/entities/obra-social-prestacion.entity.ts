import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ObraSocial } from './obra-social.entity';
import { Prestacion } from '../../configuracion/entities/prestacion.entity';

@Entity('obras_sociales_prestaciones')
export class ObraSocialPrestacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'obra_social_id' })
  obraSocialId: string;

  @ManyToOne(() => ObraSocial, (os) => os.prestaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'obra_social_id' })
  obraSocial: ObraSocial;

  @Column({ name: 'prestacion_id' })
  prestacionId: string;

  @ManyToOne(() => Prestacion, { eager: true })
  @JoinColumn({ name: 'prestacion_id' })
  prestacion: Prestacion;

  // Precio específico para esta obra social (override del honorario base)
  @Column('decimal', { precision: 12, scale: 2 })
  precio: number;

  @CreateDateColumn()
  createdAt: Date;
}
