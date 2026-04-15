import { Paciente } from '../pacientes/types';

export interface Turno {
  id: string;
  sucursalId?: string;
  pacienteId: string;
  paciente: Paciente;
  profesionalId: string;
  profesional: {
    id: string;
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
  consultorioId: string;
  consultorio: {
    id: string;
    nombre: string;
  };
  fechaInicio: string;
  fechaFin: string;
  estado: 'programado' | 'confirmado' | 'atendido' | 'cancelado' | 'ausente';
  motivo?: string;
  /** Presente si el turno pertenece a una serie creada como recurrente. */
  serieRecurrenciaId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTurnoDto {
  pacienteId: string;
  profesionalId: string;
  consultorioId: string;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
  estado?: string;
}

export interface UpdateTurnoDto extends Partial<CreateTurnoDto> {}

export type FrecuenciaRecurrencia = 'diaria' | 'semanal' | 'quincenal' | 'mensual';
export type FinSerieRecurrencia = 'fecha' | 'cantidad';

export interface CreateTurnosRecurrentesDto extends CreateTurnoDto {
  frecuencia: FrecuenciaRecurrencia;
  finSerie: FinSerieRecurrencia;
  /** Fin de serie por fecha (YYYY-MM-DD), inclusive. */
  hastaFecha?: string;
  /** Número de turnos (2–104) cuando finSerie es cantidad. */
  cantidad?: number;
}

export interface TurnosFiltros {
  fecha?: string;
  desde?: string;
  hasta?: string;
  profesionalId?: string;
  consultorioId?: string;
  pacienteId?: string;
  estado?: string;
}

export interface Profesional {
  id: string;
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
  };
  especialidad: string;
}

export interface Consultorio {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface DisponibilidadResponse {
  disponible: boolean;
  conflictos: { tipo: string; turnoId: string; fechaInicio: string; fechaFin: string }[];
}
