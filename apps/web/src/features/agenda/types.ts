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

export interface TurnosFiltros {
  fecha?: string;
  profesionalId?: string;
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
