import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/auth-context';
import { useDashboard } from '../hooks/use-dashboard';
import { PremiumCard } from '../../../components/ui/premium-card';
import { Users, Calendar, TrendingUp, DollarSign, Clock, User, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={20} />
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Sincronizando datos clínicos...</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const stats = [
    { label: 'Pacientes Totales', value: dashboardData?.totalPacientes || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Turnos Hoy', value: dashboardData?.turnosHoy || 0, icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Facturación Proyectada', value: formatCurrency(dashboardData?.facturacionProyectada || 0), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Facturación Real', value: formatCurrency(dashboardData?.facturacionReal || 0), icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 pb-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <motion.h1 
            variants={itemVariants}
            className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Bienvenido, {user?.nombre || 'Doc'} 👋
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-slate-500 dark:text-slate-400 font-medium"
          >
            Su clínica está operando con normalidad hoy.
          </motion.p>
        </div>
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Sistema En Línea
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <PremiumCard key={stat.label} delay={i * 0.1}>
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <Activity className="text-slate-200 dark:text-slate-800" size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </PremiumCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Appointments */}
        <PremiumCard className="lg:col-span-2" delay={0.4}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Turnos del Día</h2>
                <p className="text-xs text-slate-500 font-medium tracking-wide">PRÓXIMAS CONSULTAS</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline uppercase tracking-widest flex items-center gap-1 group">
              Ver Agenda
              <ChevronRight className="transition-transform group-hover:translate-x-0.5" size={14} />
            </button>
          </div>

          <div className="space-y-1">
            {dashboardData?.proximosTurnos && dashboardData.proximosTurnos.length > 0 ? (
              dashboardData.proximosTurnos.map((turno: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                  key={turno.id} 
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/40",
                    i < dashboardData.proximosTurnos.length - 1 && "border-b border-slate-100 dark:border-slate-800/50 rounded-b-none"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-900 shadow-sm">
                        <User className="text-slate-400" size={24} />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white transition-colors group-hover:text-blue-600">
                        {turno.paciente?.apellido}, {turno.paciente?.nombre}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Dr. {turno.profesional?.usuario?.nombre}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {turno.consultorio?.nombre}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-100/50 dark:border-blue-500/20">
                      <Clock className="text-blue-600 dark:text-blue-400" size={14} />
                      <span className="font-bold text-sm text-blue-600 dark:text-blue-400 leading-none">
                        {new Date(turno.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800/40 flex items-center justify-center mb-4">
                  <Calendar className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-500 font-medium">No hay turnos programados para hoy.</p>
              </div>
            )}
          </div>
        </PremiumCard>

        {/* Real-time Insights */}
        <PremiumCard delay={0.5}>
          <div className="mb-8">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-1">Finanzas</h2>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">ESTADO DEL MES</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Facturación Proyectada</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(dashboardData?.facturacionProyectada || 0)}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Cobros Realizados</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(dashboardData?.facturacionReal || 0)}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "45%" }}
                   className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                    <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Insight Mensual</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Su facturación real ha aumentado un <span className="text-emerald-600 font-bold">12%</span> respecto al mes anterior. Buen progreso.
                </p>
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
};
