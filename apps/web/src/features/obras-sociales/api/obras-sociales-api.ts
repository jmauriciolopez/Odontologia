import { httpClient } from '../../../lib/Httpclient';
import { ObraSocial, ObraSocialPrestacion, CreateObraSocialDto, UpsertPreciosDto } from '../types';

export const obrasSocialesApi = {
  findAll: () => httpClient.get<ObraSocial[]>('obras-sociales'),
  findOne: (id: string) => httpClient.get<ObraSocial>(`obras-sociales/${id}`),
  create: (data: CreateObraSocialDto) => httpClient.post<ObraSocial>('obras-sociales', data),
  update: (id: string, data: Partial<CreateObraSocialDto> & { activo?: boolean }) =>
    httpClient.patch<ObraSocial>(`obras-sociales/${id}`, data),
  remove: (id: string) => httpClient.delete(`obras-sociales/${id}`),

  getPrestaciones: (id: string) =>
    httpClient.get<ObraSocialPrestacion[]>(`obras-sociales/${id}/prestaciones`),
  upsertPrecios: (id: string, data: UpsertPreciosDto) =>
    httpClient.post<ObraSocialPrestacion[]>(`obras-sociales/${id}/prestaciones`, data),
  deletePrecio: (id: string, prestacionId: string) =>
    httpClient.delete(`obras-sociales/${id}/prestaciones/${prestacionId}`),
};
