import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FichaClinica } from '../../fichas-clinicas/entities/ficha-clinica.entity';

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

  @OneToOne(() => FichaClinica, (ficha) => ficha.paciente)
  fichaClinica: FichaClinica;
}
