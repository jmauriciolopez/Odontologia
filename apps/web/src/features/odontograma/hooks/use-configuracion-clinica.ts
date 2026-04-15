import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/lib/Httpclient';

export const CONFIGURACION_CLINICA_QUERY_KEY = ['configuracion-clinica'] as const;

export function useConfiguracionClinica() {
  return useQuery({
    queryKey: CONFIGURACION_CLINICA_QUERY_KEY,
    queryFn: () => httpClient.get<{ sistemaDental?: string }>('configuracion'),
  });
}
