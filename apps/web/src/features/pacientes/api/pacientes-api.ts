import { httpClient } from '../../../lib/Httpclient';
import { Paciente } from '../types';

export const pacientesApi = {
  getPacientes: async (params?: { query?: string }): Promise<Paciente[]> => {
    return httpClient.get('pacientes', { params });
  },

  getPacienteById: async (id: string): Promise<Paciente> => {
    return httpClient.get(`pacientes/${id}`);
  },

  createPaciente: async (data: Partial<Paciente>): Promise<Paciente> => {
    return httpClient.post('pacientes', data);
  },

  updatePaciente: async (id: string, data: Partial<Paciente>): Promise<Paciente> => {
    return httpClient.patch(`pacientes/${id}`, data);
  },

  addEvolucion: async (fichaId: string, data: { descripcion: string, categoria?: string }): Promise<any> => {
    return httpClient.post(`fichas-clinicas/evoluciones`, { fichaId, ...data });
  },

  getFichaByPacienteId: async (pacienteId: string): Promise<any> => {
    return httpClient.get(`fichas-clinicas/paciente/${pacienteId}`);
  },

  upsertMedicionPeriodontal: async (fichaId: string, diente: number, data: any): Promise<any> => {
    return httpClient.post(`fichas-clinicas/${fichaId}/mediciones-periodontales/${diente}`, data);
  }
};
