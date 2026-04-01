import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pacientesApi } from '../api/pacientes-api';

export const usePacientes = (params?: any) => {
  return useQuery({
    queryKey: ['pacientes', params],
    queryFn: () => pacientesApi.findAll(params),
  });
};

export const usePacienteDetalle = (id: string) => {
  return useQuery({
    queryKey: ['paciente', id],
    queryFn: () => pacientesApi.findOne(id),
    enabled: !!id,
  });
};

export const usePacienteMutations = () => {
  const queryClient = useQueryClient();

  const createPaciente = useMutation({
    mutationFn: (data: any) => pacientesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
    },
  });

  const updatePaciente = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pacientesApi.update(id, data),
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
      pacientesApi.createEvolucion(fichaId, data),
    onSuccess: (_, { fichaId }) => {
      // Invalida ficha para actualizar lista de evoluciones. 
      // Por simplicidad, asumimos que fichaId está ligada a un paciente específico.
      queryClient.invalidateQueries({ queryKey: ['paciente'] }); 
    },
  });

  return { createEvolucion };
};
