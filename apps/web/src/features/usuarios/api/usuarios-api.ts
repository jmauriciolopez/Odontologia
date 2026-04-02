import { httpClient } from '../../../lib/Httpclient';
import { Usuario, CreateUsuarioDto } from '../types';

export const usuariosApi = {
  findAll: async () => {
    return await httpClient.get<Usuario[]>('usuarios');
  },

  findOne: async (id: string) => {
    return await httpClient.get<Usuario>(`usuarios/${id}`);
  },

  create: async (data: CreateUsuarioDto) => {
    return await httpClient.post<Usuario>('usuarios', data);
  },

  getRoles: async () => {
    return await httpClient.get<any[]>('usuarios/roles');
  }
};
