import { httpClient } from '../../../lib/Httpclient';
import { Paciente, EvolucionClinica, Antecedente, FichaClinica, MedicionPeriodontal } from '../types';
import { PaginatedResponse } from '../../../types/pagination';

export const pacientesApi = {
  getPacientes: async (params?: { query?: string, page?: number, limit?: number }): Promise<PaginatedResponse<Paciente>> => {
    return httpClient.get<PaginatedResponse<Paciente>>('pacientes', { params });
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

  addEvolucion: async (fichaId: string, data: { descripcion: string, categoria?: string }): Promise<EvolucionClinica> => {
    return httpClient.post(`fichas-clinicas/evoluciones`, { fichaId, ...data });
  },

  addAntecedente: async (data: { fichaId: string; tipo: string; descripcion: string }): Promise<Antecedente> => {
    return httpClient.post('fichas-clinicas/antecedentes', data);
  },

  getFichaByPacienteId: async (pacienteId: string): Promise<FichaClinica> => {
    return httpClient.get(`fichas-clinicas/paciente/${pacienteId}`);
  },

  upsertMedicionPeriodontal: async (fichaId: string, diente: number, data: Partial<MedicionPeriodontal>): Promise<MedicionPeriodontal> => {
    return httpClient.post(`fichas-clinicas/${fichaId}/mediciones-periodontales/${diente}`, data);
  }
};
