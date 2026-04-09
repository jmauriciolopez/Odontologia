import React from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Users, Home, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onNewTurno: () => void;
  view: 'day' | 'week';
  onViewChange: (view: 'day' | 'week') => void;
  profesionalNombre?: string;
  consultorioNombre?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate, onDateChange, onNewTurno, view, onViewChange,
  profesionalNombre, consultorioNombre,
}) => {
  const getLabel = () => {
    if (view === 'day') return format(currentDate, "EEEE, d 'de' MMMM", { locale: es });
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end   = endOfWeek(currentDate,   { weekStartsOn: 1 });
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM, yyyy')}`;
  };

  const navBtnCls = 'p-2 rounded-lg transition-all hover:opacity-80';

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Left: nav + label */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center p-1 rounded-xl shadow-sm"
          style={{ background: 'var(--sb-active-bg)', border: '1px solid var(--sb-border)' }}
        >
          <button
            onClick={() => onDateChange(view === 'day' ? subDays(currentDate, 1) : subDays(currentDate, 7))}
            className={navBtnCls}
            style={{ color: 'var(--sb-text-muted)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-600 rounded-lg transition-all hover:opacity-80"
          >
            Hoy
          </button>
          <button
            onClick={() => onDateChange(view === 'day' ? addDays(currentDate, 1) : addDays(currentDate, 7))}
            className={navBtnCls}
            style={{ color: 'var(--sb-text-muted)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <h2 className="text-xl font-bold capitalize" style={{ color: 'var(--sb-text)' }}>
          {getLabel()}
        </h2>
      </div>

      {/* Right: view toggle + filters + new */}
      <div className="flex items-center gap-3">
        {/* View toggle */}
        <div className="flex items-center p-1 rounded-xl" style={{ background: 'var(--sb-active-bg)' }}>
          {(['day', 'week'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={cn('px-4 py-2 text-xs font-bold rounded-lg transition-all')}
              style={view === v
                ? { background: 'var(--card-bg)', color: 'var(--brand-500, #6d7bff)', boxShadow: '0 1px 3px rgba(0,0,0,.1)' }
                : { color: 'var(--sb-text-muted)' }
              }
            >
              {v === 'day' ? 'Día' : 'Semana'}
            </button>
          ))}
        </div>

        <div className="h-8 w-px hidden md:block" style={{ background: 'var(--sb-border)' }} />

        {(profesionalNombre || consultorioNombre) && (
          <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20">
            {profesionalNombre && (
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Users size={14} /> {profesionalNombre}
              </span>
            )}
            {consultorioNombre && (
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Home size={14} /> {consultorioNombre}
              </span>
            )}
          </div>
        )}

        <button
          onClick={onNewTurno}
          className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nuevo Turno</span>
        </button>
      </div>
    </div>
  );
};
