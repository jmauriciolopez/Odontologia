import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { finanzasApi } from '../api/finanzas-api';
import { CreatePresupuestoDto, CreatePagoDto } from '../types';

export const usePresupuestos = (params?: any) => {
  return useQuery({
    queryKey: ['presupuestos', params],
    queryFn: () => finanzasApi.findAll(params),
  });
};

export const usePresupuestoDetalle = (id: string) => {
  return useQuery({
    queryKey: ['presupuesto', id],
    queryFn: () => finanzasApi.findOne(id),
    enabled: !!id,
  });
};

export const usePacienteFinanzas = (pacienteId: string) => {
  return useQuery({
    queryKey: ['presupuestos', 'paciente', pacienteId],
    queryFn: () => finanzasApi.findByPaciente(pacienteId),
    enabled: !!pacienteId,
  });
};

export const useFinanzasMutations = () => {
  const queryClient = useQueryClient();

  const createPresupuesto = useMutation({
    mutationFn: (data: CreatePresupuestoDto) => finanzasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
    },
  });

  const registerPago = useMutation({
    mutationFn: (data: CreatePagoDto) => finanzasApi.registerPago(data),
    onSuccess: (_, { presupuestoId }) => {
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
      queryClient.invalidateQueries({ queryKey: ['presupuesto', presupuestoId] });
      queryClient.invalidateQueries({ queryKey: ['pagos', presupuestoId] });
    },
  });

  return { createPresupuesto, registerPago };
};
