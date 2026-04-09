import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obrasSocialesApi } from '../api/obras-sociales-api';
import { CreateObraSocialDto, UpsertPreciosDto } from '../types';

export const useObrasSociales = () =>
  useQuery({ queryKey: ['obras-sociales'], queryFn: obrasSocialesApi.findAll });

export const useObraSocialDetalle = (id: string | null) =>
  useQuery({
    queryKey: ['obra-social', id],
    queryFn: () => obrasSocialesApi.findOne(id!),
    enabled: !!id,
  });

export const useObrasSocialesMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['obras-sociales'] });

  const create = useMutation({
    mutationFn: (data: CreateObraSocialDto) => obrasSocialesApi.create(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => obrasSocialesApi.update(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => obrasSocialesApi.remove(id),
    onSuccess: invalidate,
  });

  const upsertPrecios = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpsertPreciosDto }) =>
      obrasSocialesApi.upsertPrecios(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['obra-social', id] });
      invalidate();
    },
  });

  const deletePrecio = useMutation({
    mutationFn: ({ id, prestacionId }: { id: string; prestacionId: string }) =>
      obrasSocialesApi.deletePrecio(id, prestacionId),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ['obra-social', id] }),
  });

  return { create, update, remove, upsertPrecios, deletePrecio };
};
