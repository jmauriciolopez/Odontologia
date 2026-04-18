import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      onError: (error: any) => {
        const status = error?.status;
        if (status === 401) return; // ya manejado por httpClient (redirect)
        if (status === 403) {
          toast.error('Sin permisos para realizar esta acción');
          return;
        }
        const msg = error?.message || 'Ocurrió un error inesperado';
        toast.error(msg);
      },
    },
  },
});
