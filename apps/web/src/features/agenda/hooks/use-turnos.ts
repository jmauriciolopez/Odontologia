import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendaApi } from '../api/agenda-api';
import { TurnosFiltros, CreateTurnoDto, UpdateTurnoDto } from '../types';

export const useTurnos = (filtros?: TurnosFiltros) => {
  return useQuery({
    queryKey: ['turnos', filtros],
    queryFn: () => agendaApi.findAll(filtros),
    refetchInterval: 10000, // 10 seconds polling for 'realtime' feel without high overhead
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
