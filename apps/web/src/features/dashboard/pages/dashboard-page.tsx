import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/auth-context';
import { useDashboard, useHistoricalDashboard } from '../hooks/use-dashboard';
import { DashboardChart } from '../components/dashboard-chart';
import { WelcomeDashboard } from '../components/welcome-dashboard';
import { PremiumCard } from '../../../components/ui/premium-card';
import { 
  Users, 
  Calendar, 
  TrendUp, 
  CurrencyDollar, 
  Clock, 
  User, 
  CaretRight, 
  Pulse, 
  Funnel, 
  FileArrowDown 
} from '@phosphor-icons/react';
import { httpClient } from '../../../lib/Httpclient';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: isLoadingStats } = useDashboard();

  // Rango histórico predeterminado: últimos 6 meses
  const [dateRange, setDateRange] = React.useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const { data: historicalData, isLoading: isLoadingHistorical } = useHistoricalDashboard(dateRange.from, dateRange.to);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isExportingCobranza, setIsExportingCobranza] = React.useState(false);
  const [isExportingPacientes, setIsExportingPacientes] = React.useState(false);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      await httpClient.downloadFile(
        '/dashboard/historical/export-pdf',
        `reporte-dashboard-${dateRange.from}-a-${dateRange.to}.pdf`,
        { from: dateRange.from, to: dateRange.to }
      );
      toast.success('Reporte exportado correctamente');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast.error('Error al generar el PDF del dashboard');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCobranza = async () => {
    if (user?.rol !== 'admin') {
      toast.error('Acceso restringido a Administradores');
      return;
    }
    try {
      setIsExportingCobranza(true);
      await httpClient.downloadFile(
        '/dashboard/reports/cobranza/export-pdf',
        `reporte-cobranza-${dateRange.from}-a-${dateRange.to}.pdf`,
        { from: dateRange.from, to: dateRange.to }
      );
      toast.success('Reporte de cobranza exportado');
    } catch (error) {
      toast.error('Error al exportar cobranza');
    } finally {
      setIsExportingCobranza(false);
    }
  };

  const handleExportPacientes = async () => {
    try {
      setIsExportingPacientes(true);
      await httpClient.downloadFile(
        '/dashboard/reports/pacientes-nuevos/export-pdf',
        `reporte-nuevos-pacientes-${dateRange.from}-a-${dateRange.to}.pdf`,
        { from: dateRange.from, to: dateRange.to }
      );
      toast.success('Reporte de nuevos pacientes exportado');
    } catch (error) {
      toast.error('Error al exportar pacientes');
    } finally {
      setIsExportingPacientes(false);
    }
  };

  if (isLoadingStats) {
    return (
      <div className="flex flex-col gap-8 pb-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg opacity-60" />
          </div>
          <div className="flex gap-3">
             <Skeleton className="h-10 w-32 rounded-xl" />
             <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-premium p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-4 w-12 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded-lg opacity-60" />
                <Skeleton className="h-8 w-32 rounded-xl" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 card-premium p-6 h-[400px]">
              <Skeleton className="h-6 w-48 mb-6" />
              <Skeleton className="h-full w-full rounded-2xl" />
           </div>
           <div className="card-premium p-6 h-[400px]">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="flex justify-center items-center h-full">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

  if (dashboardData && (dashboardData.totalConsultorios === 0 || dashboardData.totalProfesionales === 0 || dashboardData.totalPacientes === 0)) {
    return <WelcomeDashboard stats={dashboardData} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0 },
  };

  const stats = [
    { label: 'Pacientes Totales',      value: dashboardData?.totalPacientes || 0,                              icon: Users,          color: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Turnos Hoy',             value: dashboardData?.turnosHoy || 0,                                   icon: Calendar,       color: 'text-indigo-500',  bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Facturación Proyectada', value: formatCurrency(dashboardData?.facturacionProyectada || 0),       icon: TrendUp,        color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Facturación Real',       value: formatCurrency(dashboardData?.facturacionReal || 0),             icon: CurrencyDollar, color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
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
            className="font-heading text-3xl font-bold tracking-tighter"
            style={{ color: 'var(--sb-text)' }}
          >
            Bienvenido, {user?.nombre || 'Doc'}
          </motion.h1>
          <motion.p variants={itemVariants} className="font-medium" style={{ color: 'var(--sb-text-muted)' }}>
            Su clínica está operando con normalidad hoy.
          </motion.p>
        </div>
        
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card/50 backdrop-blur-sm border-border">
            <Funnel size={14} weight="bold" className="text-muted-foreground" aria-hidden="true" />
            <input 
              type="date" 
              id="fecha-desde"
              aria-label="Fecha inicio para filtro histórico"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="bg-transparent text-xs font-mono font-medium outline-none focus:ring-0 w-28"
            />
            <span className="text-muted-foreground text-xs" aria-hidden="true">—</span>
            <input 
              type="date" 
              id="fecha-hasta"
              aria-label="Fecha fin para filtro histórico"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="bg-transparent text-xs font-medium outline-none focus:ring-0 w-28"
            />
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleExportPdf}
              disabled={isExporting}
              title="Exportar Resumen Histórico"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 transition-all disabled:opacity-50"
            >
              <FileArrowDown size={14} weight="bold" className={cn(isExporting && "animate-bounce")} />
              {isExporting ? '...' : 'General'}
            </motion.button>

            {user?.rol === 'admin' && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportCobranza}
                  disabled={isExportingCobranza}
                  title="Reporte Detallado de Cobranza"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-all disabled:opacity-50"
                >
                  <CurrencyDollar size={14} weight="bold" className={cn(isExportingCobranza && "animate-bounce")} />
                  {isExportingCobranza ? '...' : 'Cobranza'}
                </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleExportPacientes}
              disabled={isExportingPacientes}
              title="Reporte de Nuevos Pacientes"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-all disabled:opacity-50"
            >
              <Users size={14} weight="bold" className={cn(isExportingPacientes && "animate-bounce")} />
              {isExportingPacientes ? '...' : 'Pacientes'}
            </motion.button>
          </div>

          <div
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border"
            style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text-muted)' }}
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            En Línea
          </div>
        </motion.div>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            variants={itemVariants}
            className={cn(
              "h-full",
              i === 0 && "lg:col-span-1",
              i === 1 && "lg:col-span-1",
              i === 2 && "lg:col-span-2",
              i === 3 && "lg:col-span-2"
            )}
          >
            <PremiumCard className="h-full p-5 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex flex-col h-full justify-between gap-4">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2 rounded-xl", stat.bg)}>
                    <stat.icon weight="bold" className={stat.color} size={20} />
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-70">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-mono font-bold tracking-tighter">
                    {stat.value}
                  </p>
                </div>
              </div>
            </PremiumCard>
          </motion.div>
        ))}
      </div>

      {/* Historical Chart */}
      <motion.div variants={itemVariants}>
        <DashboardChart 
          data={historicalData || []} 
          isLoading={isLoadingHistorical} 
        />
      </motion.div>
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
              <CaretRight className="transition-transform group-hover:translate-x-0.5" size={14} weight="bold" />
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
                <span className="font-medium" style={{ color: 'var(--sb-text-muted)' }}>Facturación Proyectada</span>
                <span className="font-mono font-bold" style={{ color: 'var(--sb-text)' }}>{formatCurrency(dashboardData?.facturacionProyectada || 0)}</span>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--sb-active-bg)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-2">
                <span className="font-medium" style={{ color: 'var(--sb-text-muted)' }}>Cobros Realizados</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(dashboardData?.facturacionReal || 0)}</span>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--sb-active-bg)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--sb-border)' }}>
              <div className="rounded-2xl p-4" style={{ background: 'var(--sb-active-bg)', border: '1px solid var(--sb-border)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                    <TrendUp className="text-emerald-600 dark:text-emerald-400" size={16} weight="bold" />
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
