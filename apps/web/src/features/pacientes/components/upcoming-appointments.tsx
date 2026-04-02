import React from 'react';
import { useTurnos } from '../../agenda/hooks/use-turnos';
import { Turno } from '../../agenda/types';
import { format } from 'date-fns';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';

interface UpcomingAppointmentsProps {
  pacienteId: string;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ pacienteId }) => {
  const { data: turnos = [], isLoading } = useTurnos({ pacienteId });

  const upcoming = turnos
    .filter(t => t.estado === 'programado' || t.estado === 'confirmado')
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
    .slice(0, 3);

  if (isLoading) {
    return <div className="text-sm text-slate-500">Cargando citas...</div>;
  }

  if (upcoming.length === 0) {
    return <div className="text-sm text-slate-500">No hay citas próximas.</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-700 mb-1 flex items-center">
        <CalendarDays className="mr-1 h-4 w-4" /> Próximas citas
      </h3>
      <ul className="space-y-1">
        {upcoming.map((turno: Turno) => (
          <li
            key={turno.id}
            className="flex items-center justify-between bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-sm"
          >
            <span>{format(new Date(turno.fechaInicio), 'dd/MM/yyyy HH:mm')}</span>
            <span className="flex items-center gap-1">
              {turno.estado === 'confirmado' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="capitalize">{turno.estado}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
