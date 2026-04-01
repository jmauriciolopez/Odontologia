import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Turno } from '../turnos/entities/turno.entity';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Turno)
    private readonly turnosRepository: Repository<Turno>,
  ) {}

  // Se ejecuta todos los días a las 09:00 AM
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
      relations: ['paciente', 'profesional'],
    });

    this.logger.log(`Se encontraron ${turnosMañana.length} turnos para mañana.`);

    for (const turno of turnosMañana) {
      this.sendMockReminder(turno);
    }
  }

  private sendMockReminder(turno: Turno) {
    const { paciente, fechaInicio } = turno;
    const hora = new Date(fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    this.logger.log(`[RECORDAORIO MOCK]
      PARA: ${paciente.nombre} ${paciente.apellido} (${paciente.telefono})
      MENSAJE: "Hola ${paciente.nombre}, te recordamos tu turno médico para mañana a las ${hora}. Por favor confirme su asistencia."
      ESTADO: SIMULADO_OK
    `);
  }
}
