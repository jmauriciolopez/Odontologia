import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pacientesApi } from '../api/pacientes-api';

export const usePacientes = (params?: { query?: string }) => {
  return useQuery({
    queryKey: ['pacientes', params],
    queryFn: () => pacientesApi.getPacientes(params),
  });
};

export const usePacienteDetalle = (id: string) => {
  return useQuery({
    queryKey: ['paciente', id],
    queryFn: () => pacientesApi.getPacienteById(id),
    enabled: !!id,
  });
};

export const usePacienteMutations = () => {
  const queryClient = useQueryClient();

  const createPaciente = useMutation({
    mutationFn: (data: any) => pacientesApi.createPaciente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });

  const updatePaciente = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pacientesApi.updatePaciente(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      queryClient.invalidateQueries({ queryKey: ['paciente', id] });
    },
  });

  return { createPaciente, updatePaciente };
};

export const useEvolucionMutations = () => {
  const queryClient = useQueryClient();

  const createEvolucion = useMutation({
    mutationFn: ({ fichaId, data }: { fichaId: string; data: any }) => 
      pacientesApi.addEvolucion(fichaId, data),
    onSuccess: (_, { fichaId }) => {
      queryClient.invalidateQueries({ queryKey: ['paciente'] }); 
    },
  });

  return { createEvolucion };
};
