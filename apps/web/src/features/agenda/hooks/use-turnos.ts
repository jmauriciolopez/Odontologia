import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agendaApi } from '../api/agenda-api';
import { TurnoFiltros } from '../types';

export const useTurnos = (filtros?: TurnoFiltros) => {
  return useQuery({
    queryKey: ['turnos', filtros],
    queryFn: () => agendaApi.findAll(filtros),
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

export const useTurnoMutations = () => {
  const queryClient = useQueryClient();

  const createTurno = useMutation({
    mutationFn: (data: any) => agendaApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
  });

  const updateTurno = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => agendaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
    },
  });

  return { createTurno, updateTurno };
};
