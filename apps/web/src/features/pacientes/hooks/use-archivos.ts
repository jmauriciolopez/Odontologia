import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { archivosApi, PatientFile, Radiografia } from '../api/archivos-api';

export const useArchivos = (pacienteId: string) => {
  return useQuery({
    queryKey: ['archivos', pacienteId],
    queryFn: () => archivosApi.findByPaciente(pacienteId),
    enabled: !!pacienteId,
  });
};

export const useArchivosMutations = (pacienteId: string) => {
  const queryClient = useQueryClient();

  const uploadDocumento = useMutation({
    mutationFn: (file: File) => archivosApi.uploadDocumento(pacienteId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivos', pacienteId] });
    },
  });

  const uploadRadiografia = useMutation({
    mutationFn: ({ file, tipo }: { file: File, tipo: string }) => 
      archivosApi.uploadRadiografia(pacienteId, file, tipo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivos', pacienteId] });
    },
  });

  const deleteDocumento = useMutation({
    mutationFn: (id: string) => archivosApi.deleteDocumento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['archivos', pacienteId] });
    },
  });

  return { uploadDocumento, uploadRadiografia, deleteDocumento };
};
