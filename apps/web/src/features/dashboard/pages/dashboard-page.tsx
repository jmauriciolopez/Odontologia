import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/auth-context';
import { useDashboard } from '../hooks/use-dashboard';
import { PremiumCard } from '../../../components/ui/premium-card';
import { Users, Calendar, TrendingUp, DollarSign, Clock, User, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={20} />
        </div>
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--sb-text-muted)' }}>
          Sincronizando datos clínicos...
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

  const containerVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0 },
  };

  const stats = [
    { label: 'Pacientes Totales',      value: dashboardData?.totalPacientes || 0,                              icon: Users,      color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Turnos Hoy',             value: dashboardData?.turnosHoy || 0,                                   icon: Calendar,   color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Facturación Proyectada', value: formatCurrency(dashboardData?.facturacionProyectada || 0),       icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Facturación Real',       value: formatCurrency(dashboardData?.facturacionReal || 0),             icon: DollarSign, color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 pb-10"
    >
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <motion.h1
            variants={itemVariants}
            className="font-heading text-3xl font-bold tracking-tight"
            style={{ color: 'var(--sb-text)' }}
          >
            Bienvenido, {user?.nombre || 'Doc'} 👋
          </motion.h1>
          <motion.p variants={itemVariants} className="font-medium" style={{ color: 'var(--sb-text-muted)' }}>
            Su clínica está operando con normalidad hoy.
          </motion.p>
        </div>
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
          style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text-muted)' }}
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Sistema En Línea
        </motion.div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <PremiumCard key={stat.label} delay={i * 0.1}>
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-2.5 rounded-xl', stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <Activity size={20} style={{ color: 'var(--sb-border)' }} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium" style={{ color: 'var(--sb-text-muted)' }}>{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--sb-text)' }}>{stat.value}</h3>
            </div>
          </PremiumCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Turnos del día */}
        <PremiumCard className="lg:col-span-2" delay={0.4}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Clock size={20} />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--sb-text)' }}>Turnos del Día</h2>
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--sb-text-muted)' }}>Próximas Consultas</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/agenda')}
              className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline uppercase tracking-widest flex items-center gap-1 group">
              Ver Agenda
              <ChevronRight className="transition-transform group-hover:translate-x-0.5" size={14} />
            </button>
          </div>

          <div className="space-y-1">
            {dashboardData?.proximosTurnos && dashboardData.proximosTurnos.length > 0 ? (
              dashboardData.proximosTurnos.map((turno: any, i: number) => (
                <motion.div
                  key={turno.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={cn(
                    'group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:opacity-90',
                    i < dashboardData.proximosTurnos.length - 1 && 'rounded-b-none'
                  )}
                  style={i < dashboardData.proximosTurnos.length - 1
                    ? { borderBottom: '1px solid var(--sb-border)' }
                    : {}}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-sm"
                        style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)' }}
                      >
                        <User size={24} style={{ color: 'var(--sb-text-muted)' }} />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-blue-500"
                        style={{ border: '2px solid var(--card-bg)' }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold transition-colors group-hover:text-blue-600" style={{ color: 'var(--sb-text)' }}>
                        {turno.paciente?.apellido}, {turno.paciente?.nombre}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--sb-text-muted)' }}>
                          Dr. {turno.profesional?.usuario?.nombre}
                        </span>
                        <span className="h-1 w-1 rounded-full" style={{ background: 'var(--sb-border)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--sb-text-muted)' }}>
                          {turno.consultorio?.nombre}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-100/50 dark:border-blue-500/20">
                    <Clock className="text-blue-600 dark:text-blue-400" size={14} />
                    <span className="font-bold text-sm text-blue-600 dark:text-blue-400 leading-none">
                      {new Date(turno.fechaInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'var(--sb-active-bg)' }}>
                  <Calendar size={32} style={{ color: 'var(--sb-border)' }} />
                </div>
                <p className="font-medium" style={{ color: 'var(--sb-text-muted)' }}>No hay turnos programados para hoy.</p>
              </div>
            )}
          </div>
        </PremiumCard>

        {/* Finanzas */}
        <PremiumCard delay={0.5}>
          <div className="mb-8">
            <h2 className="font-heading text-xl font-bold mb-1" style={{ color: 'var(--sb-text)' }}>Finanzas</h2>
            <p className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--sb-text-muted)' }}>Estado del Mes</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium" style={{ color: 'var(--sb-text-muted)' }}>Facturación Proyectada</span>
                <span className="font-bold" style={{ color: 'var(--sb-text)' }}>{formatCurrency(dashboardData?.facturacionProyectada || 0)}</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--sb-active-bg)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium" style={{ color: 'var(--sb-text-muted)' }}>Cobros Realizados</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(dashboardData?.facturacionReal || 0)}</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--sb-active-bg)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--sb-border)' }}>
              <div className="rounded-2xl p-4" style={{ background: 'var(--sb-active-bg)', border: '1px solid var(--sb-border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                    <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--sb-text)' }}>Insight Mensual</span>
                </div>
                <p className="text-xs font-medium leading-relaxed" style={{ color: 'var(--sb-text-muted)' }}>
                  Su facturación real ha aumentado un <span className="text-emerald-600 font-bold">12%</span> respecto al mes anterior.
                </p>
              </div>
            </div>
          </div>
        </PremiumCard>
      </div>
    </motion.div>
  );
};
