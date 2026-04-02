import React from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Users, 
  Home,
  Plus
} from 'lucide-react';
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
  currentDate,
  onDateChange,
  onNewTurno,
  view,
  onViewChange,
  profesionalNombre,
  consultorioNombre
}) => {
  const getLabel = () => {
    if (view === 'day') {
      return format(currentDate, "EEEE, d 'de' MMMM", { locale: es });
    }
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM, yyyy')}`;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <button 
            onClick={() => onDateChange(view === 'day' ? subDays(currentDate, 1) : subDays(currentDate, 7))}
            className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => onDateChange(new Date())}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
          >
            Hoy
          </button>
          <button 
            onClick={() => onDateChange(view === 'day' ? addDays(currentDate, 1) : addDays(currentDate, 7))}
            className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
          {getLabel()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onViewChange('day')}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all",
              view === 'day' 
                ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            Día
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={cn(
              "px-4 py-2 text-xs font-bold rounded-lg transition-all",
              view === 'week' 
                ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            Semana
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block" />

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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nuevo Turno</span>
        </button>
      </div>
    </div>
  );
};
