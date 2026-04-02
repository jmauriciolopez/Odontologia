import { httpClient } from '../../../lib/Httpclient';
import { Presupuesto, CreatePresupuestoDto, Pago, CreatePagoDto } from '../types';

export const finanzasApi = {
  findAll: async (params?: any): Promise<Presupuesto[]> => {
    return httpClient.get('presupuestos', { params });
  },

  findOne: async (id: string): Promise<Presupuesto> => {
    return httpClient.get(`presupuestos/${id}`);
  },

  create: async (data: CreatePresupuestoDto): Promise<Presupuesto> => {
    return httpClient.post('presupuestos', data);
  },

  findByPaciente: async (pacienteId: string): Promise<Presupuesto[]> => {
    return httpClient.get(`presupuestos/paciente/${pacienteId}`);
  },

  registerPago: async (data: CreatePagoDto): Promise<Pago> => {
    return httpClient.post('presupuestos/pago', data);
  },

  getPagosByPresupuesto: async (id: string): Promise<Pago[]> => {
    return httpClient.get(`presupuestos/${id}/pagos`);
  },

  iniciarTratamiento: async (id: string): Promise<Presupuesto> => {
    return httpClient.patch(`presupuestos/${id}/iniciar`);
  }
};
