import { httpClient } from '../../../lib/Httpclient';

export interface DashboardStats {
  totalPacientes: number;
  turnosHoy: number;
  facturacionProyectada: number;
  facturacionReal: number;
  proximosTurnos: any[];
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return httpClient.get('dashboard/stats');
  }
};
