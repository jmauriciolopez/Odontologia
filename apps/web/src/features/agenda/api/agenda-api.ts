import { httpClient } from '../../../lib/Httpclient';
import {
  Turno,
  TurnosFiltros,
  DisponibilidadResponse,
  CreateTurnoDto,
  UpdateTurnoDto,
  Profesional,
  Consultorio
} from '../types';

export const agendaApi = {
  findAll: async (params?: TurnosFiltros): Promise<Turno[]> => {
    return httpClient.get<Turno[]>('turnos', { params });
  },

  findOne: async (id: string): Promise<Turno> => {
    return httpClient.get<Turno>(`turnos/${id}`);
  },

  create: async (data: CreateTurnoDto): Promise<Turno> => {
    return httpClient.post<Turno>('turnos', data);
  },

  update: async (id: string, data: UpdateTurnoDto): Promise<Turno> => {
    return httpClient.patch<Turno>(`turnos/${id}`, data);
  },

  remove: async (id: string): Promise<void> => {
    return httpClient.delete(`turnos/${id}`);
  },

  getProfesionales: async (): Promise<Profesional[]> => {
    return httpClient.get<Profesional[]>('profesionales');
  },

  getConsultorios: async (): Promise<Consultorio[]> => {
    return httpClient.get<Consultorio[]>('consultorios');
  },

  checkDisponibilidad: async (params: {
    fechaInicio: string;
    fechaFin: string;
    profesionalId: string;
    consultorioId: string;
    excludeTurnoId?: string;
  }): Promise<DisponibilidadResponse> => {
    return httpClient.get<DisponibilidadResponse>('turnos/disponibilidad', { params });
  }
};
