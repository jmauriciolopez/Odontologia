import { httpClient } from '../../../lib/Httpclient';

export enum ArchivoCategoria {
  DOCUMENTO = 'DOCUMENTO',
  RADIOGRAFIA = 'RADIOGRAFIA',
  RECETA = 'RECETA',
  ESTUDIO = 'ESTUDIO',
}

export interface Archivo {
  id: string;
  pacienteId: string;
  nombre: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
  url: string;
  categoria: ArchivoCategoria;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ArchivosResponse {
  documentos: Archivo[];
  radiografias: Archivo[];
  todos: Archivo[];
}

export const archivosApi = {
  findByPaciente: async (pacienteId: string): Promise<ArchivosResponse> => {
    return httpClient.get(`archivos/paciente/${pacienteId}`);
  },

  uploadDocumento: async (pacienteId: string, file: File): Promise<Archivo> => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post(`archivos/paciente/${pacienteId}/documento`, formData);
  },

  uploadRadiografia: async (pacienteId: string, file: File, tipo: string, fechaToma?: string): Promise<Archivo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', tipo);
    if (fechaToma) formData.append('fechaToma', fechaToma);
    return httpClient.post(`archivos/paciente/${pacienteId}/radiografia`, formData);
  },

  deleteDocumento: async (id: string): Promise<void> => {
    return httpClient.delete(`archivos/documento/${id}`);
  }
};
