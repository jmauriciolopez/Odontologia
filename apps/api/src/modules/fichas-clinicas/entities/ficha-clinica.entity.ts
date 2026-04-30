import { Entity, Column, OneToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Antecedente } from './antecedente.entity';
import { EvolucionClinica } from './evolucion-clinica.entity';
import { MedicionPeriodontal } from './medicion-periodontal.entity';

@Entity('fichas_clinicas')
export class FichaClinica extends BaseEntity {
  @Index()
  @Column({ name: 'paciente_id' })
  pacienteId!: string;

  @OneToOne(() => Paciente, (paciente) => paciente.ficha)
  @JoinColumn({ name: 'paciente_id' })
  paciente!: Paciente;

  @Column({ name: 'observaciones_generales', type: 'text', nullable: true })
  observacionesGenerales?: string;

  @OneToMany(() => Antecedente, (antecedente) => antecedente.ficha)
  antecedentes!: Antecedente[];

  @OneToMany(() => EvolucionClinica, (evolucion) => evolucion.ficha)
  evoluciones!: EvolucionClinica[];

  @OneToMany(() => MedicionPeriodontal, (medicion) => medicion.ficha)
  medicionesPeriodontales!: MedicionPeriodontal[];
}
