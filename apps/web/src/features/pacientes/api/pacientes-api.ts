import api from '../../../lib/api';
import { Paciente, CreatePacienteDto, UpdatePacienteDto } from '../types';

export const pacientesApi = {
  findAll: async (params?: any) => {
    const response = await api.get('/pacientes', { params });
    return response.data;
  },
  
  findOne: async (id: string) => {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/pacientes', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/pacientes/${id}`, data);
    return response.data;
  },

  createEvolucion: async (fichaId: string, data: any) => {
    const response = await api.post(`/fichas-clinicas/${fichaId}/evoluciones`, data);
    return response.data;
  },

  getFicha: async (fichaId: string) => {
    const response = await api.get(`/fichas-clinicas/${fichaId}`);
    return response.data;
  }
};
