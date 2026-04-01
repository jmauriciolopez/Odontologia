import api from '../../../lib/api';
import { Turno, TurnoFiltros, DisponibilidadResponse } from '../types';

export const agendaApi = {
  findAll: async (params?: TurnoFiltros): Promise<Turno[]> => {
    const response = await api.get('/turnos', { params });
    return response.data;
  },

  findOne: async (id: string): Promise<Turno> => {
    const response = await api.get(`/turnos/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<Turno> => {
    const response = await api.post('/turnos', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<Turno> => {
    const response = await api.patch(`/turnos/${id}`, data);
    return response.data;
  },

  checkDisponibilidad: async (params: any): Promise<DisponibilidadResponse> => {
    const response = await api.get('/turnos/disponibilidad', { params });
    return response.data;
  },

  getProfesionales: async () => {
    const response = await api.get('/profesionales');
    return response.data;
  },

  getConsultorios: async () => {
    const response = await api.get('/consultorios');
    return response.data;
  }
};
