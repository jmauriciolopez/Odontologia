import { useState, useEffect } from 'react';
import { agendaApi } from '../api/agenda-api';
import { DisponibilidadResponse } from '../types';

export const useDisponibilidad = (params: any) => {
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.fechaInicio && params.fechaFin && params.profesionalId && params.consultorioId) {
      const check = async () => {
        setLoading(true);
        try {
          const res = await agendaApi.checkDisponibilidad(params);
          setDisponibilidad(res);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      const delayDebounceFn = setTimeout(() => {
        check();
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [params.fechaInicio, params.fechaFin, params.profesionalId, params.consultorioId]);

  return { disponibilidad, loading };
};
