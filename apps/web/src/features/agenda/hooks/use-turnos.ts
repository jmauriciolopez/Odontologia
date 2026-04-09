import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendaApi } from '../api/agenda-api';
import { TurnosFiltros, CreateTurnoDto, UpdateTurnoDto } from '../types';

export const useTurnos = (filtros?: TurnosFiltros) => {
  // Serialize filtros to stable primitives so React Query caches correctly
  const fecha         = filtros?.fecha;
  const desde         = filtros?.desde;
  const hasta         = filtros?.hasta;
  const profesionalId = filtros?.profesionalId;
  const pacienteId    = filtros?.pacienteId;
  const estado        = filtros?.estado;

  return useQuery({
    queryKey: ['turnos', fecha, desde, hasta, profesionalId, pacienteId, estado],
    queryFn: () => agendaApi.findAll(filtros),
    refetchInterval: 10000,
  });
};

export const useProfesionales = () => {
  return useQuery({
    queryKey: ['profesionales'],
    queryFn: () => agendaApi.getProfesionales(),
  });
};

export const useConsultorios = () => {
  return useQuery({
    queryKey: ['consultorios'],
    queryFn: () => agendaApi.getConsultorios(),
  });
};

export const useAgendaActions = () => {
  const queryClient = useQueryClient();

  const createTurno = useMutation({
    mutationFn: (data: CreateTurnoDto) => agendaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
  });

  const updateTurno = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTurnoDto }) =>
      agendaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
  });

  const deleteTurno = useMutation({
    mutationFn: (id: string) => agendaApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
  });

  return {
    createTurno: createTurno.mutateAsync,
    isCreating: createTurno.isPending,
    updateTurno: updateTurno.mutateAsync,
    isUpdating: updateTurno.isPending,
    deleteTurno: deleteTurno.mutateAsync,
    isDeleting: deleteTurno.isPending
  };
};
