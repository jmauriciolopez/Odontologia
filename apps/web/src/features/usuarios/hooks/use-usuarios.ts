import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '../api/usuarios-api';
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

  return {
    usuarios: usuariosQuery.data || [],
    isLoading: usuariosQuery.isLoading,
    isError: usuariosQuery.isError,
    roles: rolesQuery.data || [],
    isLoadingRoles: rolesQuery.isLoading,
    createUsuario: createUsuarioMutation.mutateAsync,
    isCreating: createUsuarioMutation.isPending,
  };
};
