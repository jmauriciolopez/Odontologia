import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi, UpdateUsuarioDto } from '../api/usuarios-api';
import { CreateUsuarioDto } from '../types';

export const useUsuarios = () => {
  const queryClient = useQueryClient();

  const usuariosQuery = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosApi.findAll(),
  });

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: () => usuariosApi.getRoles(),
  });

  const createUsuarioMutation = useMutation({
    mutationFn: (data: CreateUsuarioDto) => usuariosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const updateUsuarioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioDto }) =>
      usuariosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  return {
    usuarios: usuariosQuery.data || [],
    isLoading: usuariosQuery.isLoading,
    isError: usuariosQuery.isError,
    roles: rolesQuery.data || [],
    isLoadingRoles: rolesQuery.isLoading,
    createUsuario: createUsuarioMutation.mutateAsync,
    isCreating: createUsuarioMutation.isPending,
    updateUsuario: updateUsuarioMutation.mutateAsync,
    isUpdating: updateUsuarioMutation.isPending,
  };
};
