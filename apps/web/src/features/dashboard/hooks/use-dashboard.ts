import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 60000, // Refresca cada minuto
  });
};
export const useHistoricalDashboard = (from: string, to: string) => {
  return useQuery({
    queryKey: ['dashboard-historical', from, to],
    queryFn: () => dashboardApi.getHistorical(from, to),
    enabled: !!from && !!to,
  });
};
