import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  MessageSquare,
  Calendar,
  User as UserIcon,
  Filter
} from 'lucide-react';
import { useReminders } from '../hooks/use-reminders';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

export const RemindersPage: React.FC = () => {
  const { data: reminders = [], isLoading } = useReminders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
      case 'confirmed': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10';
      case 'failed': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
      case 'cancelled': return 'text-slate-400 bg-slate-50 dark:bg-slate-800';
      default: return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send size={14} />;
      case 'confirmed': return <CheckCircle2 size={14} />;
      case 'failed': return <XCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Centro de Recordatorios
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            Monitoreo de notificaciones automáticas y confirmaciones
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl items-center gap-1">
              <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white dark:bg-slate-700 rounded-xl shadow-sm">WhatsApp</span>
              <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Email</span>
           </div>
           <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
             <Filter size={16} /> Filtrar
           </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <PremiumCard className="p-6 border-l-4 border-l-blue-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Enviados (Hoy)</p>
            <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black text-slate-900 dark:text-white">{reminders.filter(r => r.status === 'sent').length}</span>
               <span className="text-xs font-bold text-blue-500">+12%</span>
            </div>
         </PremiumCard>
         <PremiumCard className="p-6 border-l-4 border-l-emerald-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Confirmados</p>
            <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black text-slate-900 dark:text-white">{reminders.filter(r => r.status === 'confirmed').length}</span>
               <span className="text-xs font-bold text-emerald-500">75% Ratio</span>
            </div>
         </PremiumCard>
         <PremiumCard className="p-6 border-l-4 border-l-rose-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Fallidos</p>
            <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black text-slate-900 dark:text-white">{reminders.filter(r => r.status === 'failed').length}</span>
               <span className="text-xs font-bold text-rose-500">2 Errores</span>
            </div>
         </PremiumCard>
         <PremiumCard className="p-6 border-l-4 border-l-slate-400">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pendientes</p>
            <div className="flex items-baseline gap-2">
               <span className="text-3xl font-black text-slate-900 dark:text-white">--</span>
               <span className="text-xs font-bold text-slate-300">Programados</span>
            </div>
         </PremiumCard>
      </div>

      {/* Main Logs Table */}
      <div className="medical-card overflow-hidden bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
             <Clock size={16} className="text-blue-500" /> Historial Reciente
           </h3>
           <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Servidores Activos
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Paciente</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha Turno</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Medio</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Enviado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isLoading ? (
                 [1,2,3,4,5].map(i => (
                   <tr key={i} className="animate-pulse">
                     <td colSpan={5} className="px-8 py-4 h-16 bg-slate-50/20" />
                   </tr>
                 ))
              ) : reminders.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500">
                        {r.paciente.nombre[0]}{r.paciente.apellido[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white uppercase truncate">
                          {r.paciente.nombre} {r.paciente.apellido}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 tracking-tighter">{r.paciente.telefono}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                       <Calendar size={14} className="text-slate-300" />
                       <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                         {new Date(r.turno.fechaInicio).toLocaleDateString()}
                       </span>
                       <span className="text-[11px] font-medium text-slate-400">
                         {new Date(r.turno.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}hs
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                       <MessageSquare size={14} className="text-blue-400" />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WhatsApp</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      getStatusColor(r.status)
                    )}>
                      {getStatusIcon(r.status)}
                      {r.status}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-[10px] font-bold text-slate-400">
                      {r.sentAt ? new Date(r.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
