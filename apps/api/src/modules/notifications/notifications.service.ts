import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  /**
   * Notifica a todos los usuarios de una clínica sobre un evento
   */
  notifyClinica(clinicaId: string, event: string, data: any) {
    this.gateway.sendToClinica(clinicaId, event, data);
  }

  /**
   * Notifica sobre la creación/actualización de un turno
   */
  notifyTurnoActualizado(clinicaId: string, turnoId: string, accion: 'creado' | 'actualizado' | 'eliminado') {
    this.notifyClinica(clinicaId, 'agenda_update', {
      turnoId,
      accion,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Notifica sobre un nuevo pago o cambio en finanzas
   */
  notifyFinanzasActualizado(clinicaId: string, pacienteId: string, mensaje: string) {
    this.notifyClinica(clinicaId, 'finanzas_update', {
      pacienteId,
      mensaje,
      timestamp: new Date().toISOString(),
    });
  }
}
