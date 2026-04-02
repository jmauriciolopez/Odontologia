import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pacientesApi } from '../api/pacientes-api';

export const usePeriodontogramaMutations = (pacienteId: string) => {
  const queryClient = useQueryClient();

  const upsertMedicion = useMutation({
    mutationFn: ({ fichaId, diente, data }: { fichaId: string, diente: number, data: any }) => 
      pacientesApi.upsertMedicionPeriodontal(fichaId, diente, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paciente', pacienteId] });
    },
  });

  return { upsertMedicion };
};
