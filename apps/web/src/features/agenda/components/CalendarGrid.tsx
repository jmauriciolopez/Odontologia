import React from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  eachDayOfInterval, 
  isSameDay, 
  isToday, 
  addMinutes, 
  startOfDay, 
  setHours, 
  setMinutes,
  differenceInMinutes,
  isWithinInterval
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Turno } from '../types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, AlertCircle } from 'lucide-react';

interface CalendarGridProps {
  currentDate: Date;
  view: 'day' | 'week';
  turnos: Turno[];
  onTurnoClick: (turno: Turno) => void;
  onTimeSlotClick: (date: Date) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00 to 20:00
const SLOT_DURATION = 30; // 30 minutes slots

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  view,
  turnos,
  onTurnoClick,
  onTimeSlotClick
}) => {
  const days = view === 'day' 
    ? [currentDate] 
    : eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6)
      });

  const getTurnosForDayAndTime = (day: Date, hour: number, minute: number) => {
    const slotStart = setMinutes(setHours(startOfDay(day), hour), minute);
    const slotEnd = addMinutes(slotStart, SLOT_DURATION);

    return turnos.filter(t => {
      const tStart = new Date(t.fechaInicio);
      const tEnd = new Date(t.fechaFin);
      // If the turn overlaps at all with this slot
      return (tStart < slotEnd && tEnd > slotStart);
    });
  };

  const getTurnoStyle = (turno: Turno, day: Date) => {
    const start = new Date(turno.fechaInicio);
    const end = new Date(turno.fechaFin);
    const dayStart = setHours(startOfDay(day), 8);
    
    const top = Math.max(0, (differenceInMinutes(start, dayStart) / 60) * 80 + 40); // 80px per hour, 40px offset for header
    const height = (differenceInMinutes(end, start) / 60) * 80 - 2; // -2 for margin
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  return (
    <div className="flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-medical">
      {/* Grid Header */}
      <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
        <div className="w-16 border-r border-slate-200/50 dark:border-slate-800/50 shrink-0" />
        {days.map((day) => (
          <div 
            key={day.toISOString()} 
            className={cn(
              "flex-1 py-4 text-center border-r border-slate-200/50 last:border-0 dark:border-slate-800/50",
              isToday(day) && "bg-blue-50/30 dark:bg-blue-500/5"
            )}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              {format(day, 'EEE', { locale: es })}
            </div>
            <div className={cn(
              "text-lg font-bold flex items-center justify-center mx-auto h-8 w-8 rounded-full transition-all",
              isToday(day) ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-900 dark:text-slate-200"
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <div className="flex flex-1 overflow-y-auto min-h-[600px] relative custom-scrollbar">
        {/* Time Labels */}
        <div className="w-16 flex flex-col bg-slate-50/30 dark:bg-slate-800/30 border-r border-slate-200/50 dark:border-slate-800/50 shrink-0">
          {HOURS.map((hour) => (
            <div key={hour} className="h-20 border-b border-slate-100 dark:border-slate-800/50 relative">
              <span className="absolute -top-2.5 w-full text-center text-[10px] font-bold text-slate-400">
                {format(setHours(new Date(), hour), 'HH:00')}
              </span>
            </div>
          ))}
        </div>

        {/* Days Columns */}
        <div className="flex flex-1 relative">
          {days.map((day) => (
            <div 
              key={day.toISOString()} 
              className={cn(
                "flex-1 border-r border-slate-100 dark:border-slate-800/30 last:border-0 relative",
                isToday(day) && "bg-blue-50/10 dark:bg-blue-500/[0.02]"
              )}
            >
              {/* Hour Lines */}
              {HOURS.map((hour) => (
                <div key={hour} className="h-20 border-b border-slate-100/50 dark:border-slate-800/20" />
              ))}

              {/* Interaction Slots */}
              <div className="absolute inset-0">
                {HOURS.map((hour) => (
                  [0, 30].map((minute) => (
                    <div 
                      key={`${hour}-${minute}`}
                      onClick={() => onTimeSlotClick(setMinutes(setHours(startOfDay(day), hour), minute))}
                      className="h-10 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 cursor-pointer transition-colors"
                    />
                  ))
                ))}
              </div>

              {/* Turnos Layer */}
              <div className="absolute inset-x-0 top-0 pointer-events-none p-1">
                <AnimatePresence mode='popLayout'>
                  {turnos
                    .filter(t => isSameDay(new Date(t.fechaInicio), day))
                    .map((turno) => {
                      const style = getTurnoStyle(turno, day);
                      return (
                        <motion.div
                          key={turno.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTurnoClick(turno);
                          }}
                          className={cn(
                            "absolute left-1 right-1 rounded-xl p-2.5 shadow-sm border pointer-events-auto cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95 flex flex-col justify-between overflow-hidden group",
                            turno.estado === 'programado' && "bg-blue-50 dark:bg-blue-500/10 border-blue-200/50 dark:border-blue-500/20 text-blue-700 dark:text-blue-300",
                            turno.estado === 'confirmado' && "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
                            turno.estado === 'cancelado' && "bg-rose-50 dark:bg-rose-500/10 border-rose-200/50 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 line-through opacity-50",
                            turno.estado === 'atendido' && "bg-slate-50 dark:bg-slate-700/50 border-slate-200/50 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                          )}
                          style={style}
                        >
                          <div className="relative z-10">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold opacity-70 flex items-center gap-1 shrink-0">
                                <Clock size={10} />
                                {format(new Date(turno.fechaInicio), 'HH:mm')}
                              </span>
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                turno.estado === 'programado' && "bg-blue-500",
                                turno.estado === 'confirmado' && "bg-emerald-500",
                                turno.estado === 'cancelado' && "bg-rose-500",
                                turno.estado === 'atendido' && "bg-slate-400"
                              )} />
                            </div>
                            <h4 className="text-[11px] font-bold leading-tight line-clamp-2 uppercase">
                              {turno.paciente.nombre} {turno.paciente.apellido}
                            </h4>
                            <p className="text-[10px] font-medium opacity-60 flex items-center gap-1 mt-1 truncate">
                              <User size={10} /> {turno.profesional.usuario.nombre}
                            </p>
                          </div>
                          
                          {/* Decorative Background Icon */}
                          <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.07] transition-all rotate-12">
                            <Clock size={40} />
                          </div>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
