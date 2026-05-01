import React, { useMemo } from 'react';
import { format, addDays, startOfWeek, parseISO, isSameDay } from 'date-fns';
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

const DEFAULT_HOUR_START = 8;
const DEFAULT_HOUR_END = 20;
const SLOT_HEIGHT = 60;

const ESTADO_COLORS: Record<Turno['estado'], string> = {
  programado: 'bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-300',
  confirmado:  'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300',
  atendido:    'bg-slate-500/20 border-slate-500 text-[var(--sb-text-muted)]',
  cancelado:   'bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300',
  ausente:     'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300',
};

type TurnoLayout = Turno & {
  start: Date;
  end: Date;
  top: number;
  height: number;
  col: number;
  numCols: number;
};

/** Asigna columnas para turnos que se solapan (mismo día, horarios concurrentes). */
function layoutOverlapsForDay(
  items: { start: Date; end: Date; turno: Turno & { start: Date; end: Date; top: number; height: number } }[],
): TurnoLayout[] {
  if (items.length === 0) return [];
  const sorted = [...items].sort((a, b) => a.start.getTime() - b.start.getTime());
  const colEndTimes: number[] = [];
  const cols: number[] = [];

  for (const ev of sorted) {
    const t0 = ev.start.getTime();
    const t1 = ev.end.getTime();
    let col = -1;
    for (let c = 0; c < colEndTimes.length; c++) {
      if (t0 >= colEndTimes[c]) {
        col = c;
        colEndTimes[c] = t1;
        break;
      }
    }
    if (col === -1) {
      col = colEndTimes.length;
      colEndTimes.push(t1);
    }
    cols.push(col);
  }

  const numCols = Math.max(1, Math.max(...cols) + 1);

  return sorted.map((ev, i) => ({
    ...ev.turno,
    start: ev.start,
    end: ev.end,
    top: ev.turno.top,
    height: ev.turno.height,
    col: cols[i],
    numCols,
  }));
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate, view, turnos, onTurnoClick, onTimeSlotClick,
}) => {
  const days = useMemo(() => {
    if (view === 'day') return [currentDate];
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate, view]);

  const { hourStart, hourEnd, turnosByDay, hours, totalHeight } = useMemo(() => {
    const dayKeys = new Set(days.map(d => format(d, 'yyyy-MM-dd')));
    const map: Record<string, TurnoLayout[]> = {};
    days.forEach(day => {
      map[format(day, 'yyyy-MM-dd')] = [];
    });

    let hStart = DEFAULT_HOUR_START;
    let hEnd = DEFAULT_HOUR_END;

    const rawByDay: Record<string, (Turno & { start: Date; end: Date; top: number; height: number })[]> = {};
    days.forEach(day => {
      rawByDay[format(day, 'yyyy-MM-dd')] = [];
    });

    turnos.forEach(turno => {
      const start = parseISO(turno.fechaInicio);
      const end = parseISO(turno.fechaFin);
      const dayKey = format(start, 'yyyy-MM-dd');

      if (!dayKeys.has(dayKey)) return;

      const startFrac = start.getHours() + start.getMinutes() / 60;
      const endFrac = end.getHours() + end.getMinutes() / 60;
      hStart = Math.min(hStart, Math.floor(startFrac));
      hEnd = Math.max(hEnd, Math.ceil(endFrac));

      rawByDay[dayKey].push({
        ...turno,
        start,
        end,
        top: 0,
        height: 0,
      });
    });

    hStart = Math.max(0, hStart - 1);
    hEnd = Math.min(24, Math.max(hEnd + 1, hStart + 1));

    Object.keys(rawByDay).forEach(dayKey => {
      const list = rawByDay[dayKey];
      const withGeom = list.map(t => {
        const startFrac = t.start.getHours() + t.start.getMinutes() / 60;
        const top = (startFrac - hStart) * SLOT_HEIGHT;
        const height = Math.max(((t.end.getTime() - t.start.getTime()) / 3600000) * SLOT_HEIGHT, 24);
        return { start: t.start, end: t.end, turno: { ...t, top, height } };
      });
      map[dayKey] = layoutOverlapsForDay(withGeom);
    });

    const hourList = Array.from({ length: hEnd - hStart }, (_, i) => hStart + i);
    const height = (hEnd - hStart) * SLOT_HEIGHT;

    return {
      hourStart: hStart,
      hourEnd: hEnd,
      turnosByDay: map,
      hours: hourList,
      totalHeight: height,
    };
  }, [turnos, days]);

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden border"
      role="grid"
      aria-label="Agenda de turnos"
      style={{ background: 'var(--card-bg)', borderColor: 'var(--sb-border)', minHeight: 600 }}
    >
      <div className="flex border-b" style={{ borderColor: 'var(--sb-border)' }} role="row">
        <div className="w-16 shrink-0" role="presentation" />
        {days.map(day => {
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className="flex-1 text-center py-3 text-xs font-bold uppercase tracking-wider"
              role="columnheader"
              aria-sort="none"
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

      <div className="flex-1 overflow-y-auto" role="presentation">
        <div className="flex" style={{ height: totalHeight }} role="row">
          <div className="w-16 shrink-0 relative" role="presentation">
            {hours.map(h => (
              <div
                key={h}
                className="absolute right-2 text-xs font-medium"
                style={{
                  top: (h - hourStart) * SLOT_HEIGHT - 8,
                  color: 'var(--sb-text-muted)',
                }}
              >
                {h}:00
              </div>
            ))}
          </div>

          {days.map(day => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayTurnos = turnosByDay[dayKey] || [];
            return (
              <div
                key={day.toISOString()}
                className="flex-1 relative border-l"
                role="gridcell"
                style={{ borderColor: 'var(--sb-border)' }}
              >
                {hours.map(h => (
                  <div
                    key={h}
                    tabIndex={0}
                    role="button"
                    aria-label={`Programar turno para ${format(day, 'EEEE d', { locale: es })} a las ${h}:00`}
                    className="absolute w-full border-t cursor-pointer hover:bg-blue-500/5 transition-colors focus-visible:bg-blue-500/10 focus-visible:outline-none"
                    style={{
                      top: (h - hourStart) * SLOT_HEIGHT,
                      height: SLOT_HEIGHT,
                      borderColor: 'var(--sb-border)',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const d = new Date(day);
                        d.setHours(h, 0, 0, 0);
                        onTimeSlotClick(d);
                      }
                    }}
                    onClick={() => {
                      const d = new Date(day);
                      d.setHours(h, 0, 0, 0);
                      onTimeSlotClick(d);
                    }}
                  />
                ))}

                {dayTurnos.map(turno => {
                  const w = 100 / turno.numCols;
                  const leftPct = (turno.col / turno.numCols) * 100;
                  return (
                    <div
                      key={turno.id}
                      tabIndex={0}
                      role="button"
                      aria-label={`Turno de ${turno.paciente.nombre} ${turno.paciente.apellido}, estado ${turno.estado}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onTurnoClick(turno);
                        }
                      }}
                      onClick={(e) => { e.stopPropagation(); onTurnoClick(turno); }}
                      className={cn(
                        'absolute rounded-lg border-l-2 px-1.5 py-1 cursor-pointer',
                        'hover:brightness-110 transition-all overflow-hidden z-10',
                        'min-w-0 focus-visible:ring-2 focus-visible:ring-primary outline-none',
                        ESTADO_COLORS[turno.estado]
                      )}
                      style={{
                        top: turno.top,
                        height: turno.height,
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${w}% - 4px)`,
                      }}
                      title={`${turno.paciente.nombre} ${turno.paciente.apellido}`}
                    >
                      <p className="text-xs font-bold truncate leading-tight">
                        {turno.paciente.nombre} {turno.paciente.apellido}
                      </p>
                      {turno.height > 36 && (
                        <p className="text-[10px] opacity-75 truncate">
                          {format(turno.start, 'HH:mm')} · {turno.profesional.usuario.apellido}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
