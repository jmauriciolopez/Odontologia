import { httpClient } from '../../../lib/Httpclient';

export interface DashboardStats {
  totalPacientes: number;
  turnosHoy: number;
  facturacionProyectada: number;
  facturacionReal: number;
  proximosTurnos: any[];
  totalProfesionales: number;
  totalConsultorios: number;
}

export interface HistoricalStat {
  month: string;
  ingresos: number;
  tratamientos: number;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return httpClient.get('dashboard/stats');
  },
  getHistorical: async (from: string, to: string): Promise<HistoricalStat[]> => {
    return httpClient.get(`dashboard/historical?from=${from}&to=${to}`);
  }
};
