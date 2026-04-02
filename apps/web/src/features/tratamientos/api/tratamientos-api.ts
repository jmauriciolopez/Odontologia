import { httpClient } from '../../../lib/Httpclient';
import { PlanTratamiento, CreatePlanTratamientoDto, PlanTratamientoItem } from '../types';

export const tratamientosApi = {
  findAll: async () => {
    return await httpClient.get<PlanTratamiento[]>('planes-tratamiento');
  },

  findByPaciente: async (pacienteId: string) => {
    return await httpClient.get<PlanTratamiento[]>(`planes-tratamiento/paciente/${pacienteId}`);
  },

  findOne: async (id: string) => {
    return await httpClient.get<PlanTratamiento>(`planes-tratamiento/${id}`);
  },

  create: async (data: CreatePlanTratamientoDto) => {
    return await httpClient.post<PlanTratamiento>('planes-tratamiento', data);
  },

  updateEstado: async (id: string, estado: string) => {
    return await httpClient.patch<PlanTratamiento>(`planes-tratamiento/${id}/estado`, { estado });
  },

  updateItemEstado: async (itemId: string, estado: string) => {
    return await httpClient.patch<PlanTratamientoItem>(`planes-tratamiento/items/${itemId}/estado`, { estado });
  }
};
