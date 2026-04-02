import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tratamientosApi } from '../api/tratamientos-api';
import { PlanTratamiento, CreatePlanTratamientoDto } from '../types';

export const useTratamientos = (pacienteId?: string) => {
  const queryClient = useQueryClient();

  const { data: planes = [], isLoading, error } = useQuery({
    queryKey: ['planes-tratamiento', pacienteId || 'global'],
    queryFn: () => {
      if (pacienteId) {
        return tratamientosApi.findByPaciente(pacienteId);
      }
      return tratamientosApi.findAll();
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePlanTratamientoDto) => tratamientosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-tratamiento', pacienteId] });
    },
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) => 
      tratamientosApi.updateEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-tratamiento', pacienteId] });
    },
  });

  const updateItemEstadoMutation = useMutation({
    mutationFn: ({ itemId, estado }: { itemId: string; estado: string }) => 
      tratamientosApi.updateItemEstado(itemId, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planes-tratamiento', pacienteId] });
    },
  });

  return {
    planes,
    isLoading,
    error,
    createPlan: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePlanEstado: updateEstadoMutation.mutateAsync,
    updateItemEstado: updateItemEstadoMutation.mutateAsync,
  };
};

export const useTratamientoUnico = (id: string | undefined) => {
  return useQuery<PlanTratamiento>({
    queryKey: ['plan-tratamiento', id],
    queryFn: () => tratamientosApi.findOne(id!),
    enabled: !!id,
  });
};
