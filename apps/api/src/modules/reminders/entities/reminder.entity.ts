import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Turno } from '../../turnos/entities/turno.entity';

@Entity('reminders')
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'pacienteId' })
  paciente!: Paciente;

  @Column()
  pacienteId!: string;

  @ManyToOne(() => Turno, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turnoId' })
  turno!: Turno;

  @Column()
  turnoId!: string;

  @Column({ type: 'timestamp' })
  scheduledFor!: Date;

  @Column({ default: 'sent' })
  status!: 'pending' | 'sent' | 'failed' | 'confirmed' | 'cancelled';

  @Column({ nullable: true })
  sentAt?: Date;

  @Column({ nullable: true })
  type?: string; // 'whatsapp' | 'email'

  @CreateDateColumn()
  createdAt!: Date;
}
