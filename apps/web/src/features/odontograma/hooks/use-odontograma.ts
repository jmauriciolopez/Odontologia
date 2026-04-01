import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { odontogramaApi } from '../api/odontograma-api';
import { UpdatePiezaDto, AddProcedimientoDto } from '../types';

export const useOdontograma = (fichaId: string) => {
  return useQuery({
    queryKey: ['odontograma', fichaId],
    queryFn: () => odontogramaApi.getOdontograma(fichaId),
    enabled: !!fichaId,
  });
};

export const useOdontogramaMutations = (fichaId: string) => {
  const queryClient = useQueryClient();

  const updatePieza = useMutation({
    mutationFn: (dto: UpdatePiezaDto) => odontogramaApi.updatePieza(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odontograma', fichaId] });
    },
  });

  const addProcedimiento = useMutation({
    mutationFn: (dto: AddProcedimientoDto) => odontogramaApi.addProcedimiento(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odontograma', fichaId] });
    },
  });

  return { updatePieza, addProcedimiento };
};
