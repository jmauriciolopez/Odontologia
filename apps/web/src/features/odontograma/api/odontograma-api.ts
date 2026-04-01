import api from '../../../lib/api';
import { PiezaDental, UpdatePiezaDto, AddProcedimientoDto } from '../types';

export const odontogramaApi = {
  getOdontograma: async (fichaId: string): Promise<PiezaDental[]> => {
    const response = await api.get(`/odontograma/ficha/${fichaId}`);
    return response.data;
  },

  updatePieza: async (dto: UpdatePiezaDto): Promise<PiezaDental> => {
    const response = await api.patch('/odontograma/pieza', dto);
    return response.data;
  },

  addProcedimiento: async (dto: AddProcedimientoDto) => {
    const response = await api.post('/odontograma/procedimiento', dto);
    return response.data;
  }
};
