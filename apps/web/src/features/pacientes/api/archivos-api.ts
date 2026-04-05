import { httpClient } from '../../../lib/Httpclient';

export interface PatientFile {
  id: string;
  pacienteId: string;
  nombreArchivo: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
  url: string;
  createdAt: string;
}

export interface Radiografia extends PatientFile {
  tipo: string;
  fechaToma: string;
}

export interface ArchivosResponse {
  documentos: PatientFile[];
  radiografias: Radiografia[];
}

export const archivosApi = {
  findByPaciente: async (pacienteId: string): Promise<ArchivosResponse> => {
    return httpClient.get(`archivos/paciente/${pacienteId}`);
  },

  uploadDocumento: async (pacienteId: string, file: File): Promise<PatientFile> => {
    const formData = new FormData();
    formData.append('file', file);
    return httpClient.post(`archivos/paciente/${pacienteId}/documento`, formData);
  },

  uploadRadiografia: async (pacienteId: string, file: File, tipo: string, fechaToma?: string): Promise<Radiografia> => {
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
