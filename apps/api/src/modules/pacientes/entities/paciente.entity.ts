import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FichaClinica } from '../../fichas-clinicas/entities/ficha-clinica.entity';
import { ObraSocial } from '../../obras-sociales/entities/obra-social.entity';

@Entity('pacientes')
export class Paciente extends BaseEntity {
  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true, nullable: true })
  documento: string;

  @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ nullable: true })
  genero: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ name: 'obra_social', nullable: true })
  obraSocial: string;

  @Column({ name: 'nro_afiliado', nullable: true })
  nroAfiliado: string;

  @Column({ name: 'obra_social_id', nullable: true })
  obraSocialId: string;

  @ManyToOne(() => ObraSocial, { nullable: true, eager: false })
  @JoinColumn({ name: 'obra_social_id' })
  obraSocialData: ObraSocial;

  @OneToOne(() => FichaClinica, (ficha) => ficha.paciente)
  ficha: FichaClinica;
}
