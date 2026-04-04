import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin-api';
import { CreateConsultorioDto, CreateProfesionalDto } from '../types';

export const useConsultorios = () => {
  return useQuery({
    queryKey: ['consultorios'],
    queryFn: () => adminApi.findAllConsultorios(),
  });
};

export const useProfesionales = () => {
  return useQuery({
    queryKey: ['profesionales'],
    queryFn: () => adminApi.findAllProfesionales(),
  });
};

export const useConsultorioMutations = () => {
  const queryClient = useQueryClient();

  const createConsultorio = useMutation({
    mutationFn: (data: CreateConsultorioDto) => adminApi.createConsultorio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultorios'] });
    },
  });

  const deleteConsultorio = useMutation({
    mutationFn: (id: string) => adminApi.deleteConsultorio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultorios'] });
    },
  });
  
  const updateConsultorio = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<CreateConsultorioDto> }) => 
      adminApi.updateConsultorio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultorios'] });
    },
  });

  return {
    createConsultorio,
    deleteConsultorio,
    updateConsultorio,
  };
};

export const useProfesionalMutations = () => {
  const queryClient = useQueryClient();

  const createProfesional = useMutation({
    mutationFn: (data: CreateProfesionalDto) => adminApi.createProfesional(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profesionales'] });
    },
  });

  const deleteProfesional = useMutation({
    mutationFn: (id: string) => adminApi.deleteProfesional(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profesionales'] });
    },
  });

  const updateProfesional = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<CreateProfesionalDto> }) => 
      adminApi.updateProfesional(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profesionales'] });
    },
  });

  return {
    createProfesional,
    deleteProfesional,
    updateProfesional
  };
};
