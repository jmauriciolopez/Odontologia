import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Turno } from '../turnos/entities/turno.entity';
import { Reminder } from './entities/reminder.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
    @InjectRepository(Reminder)
    private readonly remindersRepository: Repository<Reminder>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleCron() {
    this.logger.log('Iniciando proceso de recordatorios automáticos...');

    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    mañana.setHours(0, 0, 0, 0);

    const finMañana = new Date(mañana);
    finMañana.setHours(23, 59, 59, 999);

    const turnosMañana = await this.turnosRepository.find({
      where: {
        fechaInicio: Between(mañana, finMañana),
        estado: 'programado'
      },
      relations: ['paciente'],
    });

    for (const turno of turnosMañana) {
      await this.sendAndSaveReminder(turno);
    }
  }

  private async sendAndSaveReminder(turno: Turno) {
    const { paciente, fechaInicio } = turno;

    // Simulate WhatsApp send
    const reminder = this.remindersRepository.create({
      pacienteId: paciente.id,
      turnoId: turno.id,
      scheduledFor: fechaInicio,
      status: 'sent',
      sentAt: new Date(),
      type: 'whatsapp'
    });

    await this.remindersRepository.save(reminder);
    this.logger.log(`Recordatorio enviado y guardado para: ${paciente.nombre} ${paciente.apellido}`);
  }

  findAll() {
    return this.remindersRepository.find({
      relations: ['paciente', 'turno'],
      order: { createdAt: 'DESC' },
      take: 50
    });
  }

  async createManual(dto: CreateReminderDto): Promise<Reminder> {
    const reminder = this.remindersRepository.create({
      pacienteId: dto.pacienteId,
      turnoId: dto.turnoId,
      scheduledFor: new Date(dto.scheduledFor),
      status: 'pending',
      type: dto.type || 'whatsapp',
    });
    return await this.remindersRepository.save(reminder);
  }

  async enviarManual(id: string): Promise<Reminder> {
    const reminder = await this.remindersRepository.findOne({
      where: { id },
      relations: ['paciente', 'turno'],
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder ${id} no encontrado`);
    }

    // Mock send — reemplazar con provider real (WhatsApp/email)
    this.logger.log(`[MOCK] Enviando recordatorio a paciente ${reminder.pacienteId} via ${reminder.type}`);

    reminder.status = 'sent';
    reminder.sentAt = new Date();
    return await this.remindersRepository.save(reminder);
  }
}
