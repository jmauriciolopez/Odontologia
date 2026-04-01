import api from '../../../lib/api';
import { Presupuesto, CreatePresupuestoDto, Pago, CreatePagoDto } from '../types';

export const finanzasApi = {
  findAll: async (params?: any): Promise<Presupuesto[]> => {
    const response = await api.get('/presupuestos', { params });
    return response.data;
  },

  findOne: async (id: string): Promise<Presupuesto> => {
    const response = await api.get(`/presupuestos/${id}`);
    return response.data;
  },

  create: async (data: CreatePresupuestoDto): Promise<Presupuesto> => {
    const response = await api.post('/presupuestos', data);
    return response.data;
  },

  registerPago: async (data: CreatePagoDto): Promise<Pago> => {
    const response = await api.post('/presupuestos/pago', data);
    return response.data;
  },

  getPagosByPresupuesto: async (id: string): Promise<Pago[]> => {
    const response = await api.get(`/presupuestos/${id}/pagos`);
    return response.data;
  }
};
