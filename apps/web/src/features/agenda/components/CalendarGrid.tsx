import React, { useMemo } from 'react';
import {
  format, addDays, startOfWeek, eachHourOfInterval,
  startOfDay, endOfDay, parseISO, isWithinInterval, isSameDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Turno } from '../types';

interface CalendarGridProps {
  currentDate: Date;
  view: 'day' | 'week';
  turnos: Turno[];
  onTurnoClick: (turno: Turno) => void;
  onTimeSlotClick: (date: Date) => void;
}

const HOUR_START = 8;
const HOUR_END   = 20;
const SLOT_HEIGHT = 60; // px per hour

const ESTADO_COLORS: Record<Turno['estado'], string> = {
  programado: 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300',
  confirmado:  'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300',
  atendido:    'bg-slate-500/20 border-slate-500 text-[var(--sb-text-muted)]',
  cancelado:   'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300',
  ausente:     'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300',
};

const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate, view, turnos, onTurnoClick, onTimeSlotClick,
}) => {
  const days = useMemo(() => {
    if (view === 'day') return [currentDate];
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate, view]);

  // Pre-process and group turnos by day with parsed dates
  const turnosByDay = useMemo(() => {
    const map: Record<string, (Turno & { start: Date; end: Date; top: number; height: number })[]> = {};
    
    // Initialize map for each visible day
    days.forEach(day => {
      map[format(day, 'yyyy-MM-dd')] = [];
    });

    turnos.forEach(turno => {
      const start = parseISO(turno.fechaInicio);
      const end   = parseISO(turno.fechaFin);
      const dayKey = format(start, 'yyyy-MM-dd');
      
      if (map[dayKey]) {
        // Calculate dimensions only once
        const hours = start.getHours() + start.getMinutes() / 60;
        const top = (hours - HOUR_START) * SLOT_HEIGHT;
        const height = Math.max(((end.getTime() - start.getTime()) / 3600000) * SLOT_HEIGHT, 24);
        
        map[dayKey].push({ ...turno, start, end, top, height });
      }
    });

    return map;
  }, [turnos, days]);

  const totalHeight = (HOUR_END - HOUR_START) * SLOT_HEIGHT;

  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden border"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--sb-border)' }}
    >
      {/* Day headers */}
      <div className="flex border-b" style={{ borderColor: 'var(--sb-border)' }}>
        <div className="w-16 shrink-0" />
        {days.map(day => {
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className="flex-1 text-center py-3 text-xs font-bold uppercase tracking-wider"
              style={{ color: isToday ? 'var(--brand-500, #6d7bff)' : 'var(--sb-text-muted)' }}
            >
              <div>{format(day, 'EEE', { locale: es })}</div>
              <div
                className={cn(
                  'mx-auto mt-1 w-7 h-7 flex items-center justify-center rounded-full text-sm',
                  isToday && 'bg-blue-600 text-white'
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ height: totalHeight }}>
          {/* Hour labels */}
          <div className="w-16 shrink-0 relative">
            {hours.map(h => (
              <div
                key={h}
                className="absolute right-2 text-xs font-medium"
                style={{
                  top: (h - HOUR_START) * SLOT_HEIGHT - 8,
                  color: 'var(--sb-text-muted)',
                }}
              >
                {h}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayTurnos = turnosByDay[dayKey] || [];
            return (
              <div
                key={day.toISOString()}
                className="flex-1 relative border-l"
                style={{ borderColor: 'var(--sb-border)' }}
              >
                {/* Hour lines */}
                {hours.map(h => (
                  <div
                    key={h}
                    className="absolute w-full border-t cursor-pointer hover:bg-blue-500/5 transition-colors"
                    style={{
                      top: (h - HOUR_START) * SLOT_HEIGHT,
                      height: SLOT_HEIGHT,
                      borderColor: 'var(--sb-border)',
                    }}
                    onClick={() => {
                      const d = new Date(day);
                      d.setHours(h, 0, 0, 0);
                      onTimeSlotClick(d);
                    }}
                  />
                ))}

                {/* Turnos */}
                {dayTurnos.map(turno => (
                  <div
                    key={turno.id}
                    onClick={(e) => { e.stopPropagation(); onTurnoClick(turno); }}
                    className={cn(
                      'absolute left-1 right-1 rounded-lg border-l-2 px-2 py-1 cursor-pointer',
                      'hover:brightness-110 transition-all overflow-hidden z-10',
                      ESTADO_COLORS[turno.estado]
                    )}
                    style={{ top: turno.top, height: turno.height }}
                    title={`${turno.paciente.nombre} ${turno.paciente.apellido}`}
                  >
                    <p className="text-xs font-bold truncate leading-tight">
                      {turno.paciente.nombre} {turno.paciente.apellido}
                    </p>
                    {turno.height > 36 && (
                      <p className="text-xs opacity-75 truncate">
                        {format(turno.start, 'HH:mm')} · {turno.profesional.usuario.apellido}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
