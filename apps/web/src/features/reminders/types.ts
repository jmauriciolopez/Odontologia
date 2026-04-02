export interface Reminder {
  id: string;
  pacienteId: string;
  paciente: {
    nombre: string;
    apellido: string;
    telefono: string;
  };
  turnoId: string;
  turno: {
    fechaInicio: string;
    motivo?: string;
  };
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed' | 'confirmed' | 'cancelled';
  sentAt?: string;
  type: string;
  createdAt: string;
}
