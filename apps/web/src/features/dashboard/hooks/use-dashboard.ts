import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard-api';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 60000, // Refresca cada minuto
  });
};
