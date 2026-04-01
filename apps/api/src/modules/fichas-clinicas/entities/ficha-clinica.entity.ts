import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Antecedente } from './antecedente.entity';
import { EvolucionClinica } from './evolucion-clinica.entity';

@Entity('fichas_clinicas')
export class FichaClinica extends BaseEntity {
  @Column({ name: 'paciente_id' })
  pacienteId: string;

  @OneToOne(() => Paciente, (paciente) => paciente.fichaClinica)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'observaciones_generales', type: 'text', nullable: true })
  observacionesGenerales: string;

  @OneToMany(() => Antecedente, (antecedente) => antecedente.ficha)
  antecedentes: Antecedente[];

  @OneToMany(() => EvolucionClinica, (evolucion) => evolucion.ficha)
  evoluciones: EvolucionClinica[];
}
