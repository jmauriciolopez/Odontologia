import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Turno } from '../turnos/entities/turno.entity';
import { Reminder } from './entities/reminder.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { WhatsAppService } from './whatsapp.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
    @InjectRepository(Reminder)
    private readonly remindersRepository: Repository<Reminder>,
    private readonly whatsappService: WhatsAppService,
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
    if (!paciente.telefono) {
      this.logger.warn(`Paciente ${paciente.nombre} ${paciente.apellido} no tiene teléfono.`);
      return;
    }

    const message = this.generateMessage(paciente.nombre, fechaInicio);
    const sent = await this.whatsappService.sendMessage(paciente.telefono, message);

    const reminder = this.remindersRepository.create({
      pacienteId: paciente.id,
      turnoId: turno.id,
      scheduledFor: fechaInicio,
      status: sent ? 'sent' : 'failed',
      sentAt: sent ? new Date() : undefined,
      type: 'whatsapp'
    });

    await this.remindersRepository.save(reminder);
  }

  private generateMessage(nombre: string, fecha: Date): string {
    const f = new Date(fecha);
    const dia = f.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const hora = f.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    
    return `Hola ${nombre}! Te recordamos tu turno para el día ${dia} a las ${hora} hs. Por favor, confirma tu asistencia. ¡Te esperamos!`;
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

    if (!reminder.paciente?.telefono) {
      throw new Error('El paciente no tiene un número de teléfono registrado');
    }

    const message = this.generateMessage(reminder.paciente.nombre, reminder.scheduledFor);
    const sent = await this.whatsappService.sendMessage(reminder.paciente.telefono, message);

    reminder.status = sent ? 'sent' : 'failed';
    reminder.sentAt = sent ? new Date() : undefined;
    return await this.remindersRepository.save(reminder);
  }
}
