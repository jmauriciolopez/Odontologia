import { httpClient } from '../../../lib/Httpclient';
import { 
  Consultorio, 
  CreateConsultorioDto, 
  Profesional, 
  CreateProfesionalDto 
} from '../types';

export const adminApi = {
  // Consultorios
  findAllConsultorios: async (): Promise<Consultorio[]> => {
    return httpClient.get('consultorios');
  },
  createConsultorio: async (data: CreateConsultorioDto): Promise<Consultorio> => {
    return httpClient.post('consultorios', data);
  },
  deleteConsultorio: async (id: string): Promise<void> => {
    return httpClient.delete(`consultorios/${id}`);
  },

  // Profesionales
  findAllProfesionales: async (): Promise<Profesional[]> => {
    return httpClient.get('profesionales');
  },
  createProfesional: async (data: CreateProfesionalDto): Promise<Profesional> => {
    return httpClient.post('profesionales', data);
  },
  deleteProfesional: async (id: string): Promise<void> => {
    return httpClient.delete(`profesionales/${id}`);
  }
};
