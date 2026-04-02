import { httpClient } from '../../../lib/Httpclient';
import { PiezaDental, UpdatePiezaDto, AddProcedimientoDto } from '../types';

export const odontogramaApi = {
  getOdontograma: async (fichaId: string): Promise<PiezaDental[]> => {
    return httpClient.get(`odontograma/ficha/${fichaId}`);
  },

  updatePieza: async (dto: UpdatePiezaDto): Promise<PiezaDental> => {
    return httpClient.patch('odontograma/pieza', dto);
  },

  addProcedimiento: async (dto: AddProcedimientoDto) => {
    return httpClient.post('odontograma/procedimiento', dto);
  }
};
