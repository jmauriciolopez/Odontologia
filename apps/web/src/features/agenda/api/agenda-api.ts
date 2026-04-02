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
  }): Promise<DisponibilidadResponse> => {
    // Falls back to checking conflicts via findAll since dedicated endpoint isn't fully implemented
    const turnos = await httpClient.get<Turno[]>('turnos', { params: {
      profesionalId: params.profesionalId,
      consultorioId: params.consultorioId
    }});
    
    const start = new Date(params.fechaInicio).getTime();
    const end = new Date(params.fechaFin).getTime();
    
    const conflictos = turnos.filter(t => {
      const tStart = new Date(t.fechaInicio).getTime();
      const tEnd = new Date(t.fechaFin).getTime();
      return (start < tEnd && end > tStart);
    });

    return {
      disponible: conflictos.length === 0,
      conflictos
    };
  }
};
