import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MapPin,
  UserCircle,
  Settings as SettingsIcon,
  ShieldCheck,
  Bell,
  Database,
  CreditCard,
  ChevronRight,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PremiumCard } from '../../../components/ui/premium-card';
import { cn } from '@/lib/utils';

export const AjustesPage: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administre el personal, roles y permisos de acceso al sistema.',
      icon: Users,
      path: '/usuarios',
      color: 'blue'
    },
    {
      title: 'Consultorios y Sedes',
      description: 'Configure los espacios físicos y sillones de su clínica.',
      icon: MapPin,
      path: '/usuarios/consultorios',
      color: 'emerald'
    },
    {
      title: 'Profesionales',
      description: 'Gestione el equipo médico y sus especialidades.',
      icon: UserCircle,
      path: '/usuarios/profesionales',
      color: 'indigo'
    },
    {
      title: 'Seguridad y Logs',
      description: 'Auditoría de accesos y configuración de seguridad.',
      icon: ShieldCheck,
      path: '#',
      color: 'amber'
    },
    {
      title: 'Notificaciones',
      description: 'Configure recordatorios automáticos y avisos del sistema.',
      icon: Bell,
      path: '/reminders',
      color: 'rose'
    },
    {
      title: 'Suscripción y Plan',
      description: 'Gestione su plan SaaS y métodos de pago.',
      icon: CreditCard,
      path: '#',
      color: 'violet'
    },
    {
      title: 'Obras Sociales',
      description: 'Administre las obras sociales y sus precios por prestación.',
      icon: Building2,
      path: '/obras-sociales',
      color: 'indigo'
    },
    {
      title: 'Nomenclatura y Clínica',
      description: 'Configure sistemas dentales, colores de diagnóstico y nomenclador nacional.',
      icon: Database,
      path: '/ajustes/nomenclatura',
      color: 'orange'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-10 pb-20"
    >
      <header>
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl shadow-lg" style={{ background: 'var(--sb-text)', color: 'var(--card-bg)' }}>
            <SettingsIcon size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--sb-text-muted)]">Configuración Central</span>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-black text-[var(--sb-text)] tracking-tight uppercase"
        >
          Ajustes del Sistema
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => {
          const isDisabled = item.path === '#';
          return (
            <PremiumCard
              key={index}
              delay={0.1 * index}
              className={cn(
                'group transition-all',
                isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:border-blue-500/50 active:scale-[0.98]'
              )}
              onClick={() => !isDisabled && navigate(item.path)}
            >
              <div className="p-2 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400 transition-transform group-hover:scale-110 duration-500`}>
                    <item.icon size={28} />
                  </div>
                  {isDisabled ? (
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--sb-text-muted)]">
                      Próximamente
                    </span>
                  ) : (
                    <div className="h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white"
                      style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-border)' }}>
                      <ArrowRight size={18} />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-[var(--sb-text)] tracking-tight leading-none uppercase">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-[var(--sb-text-muted)] line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {!isDisabled && (
                  <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-[var(--sb-text-muted)] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Gestionar módulo <ChevronRight size={12} />
                  </div>
                )}
              </div>
            </PremiumCard>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="mt-10 p-10 rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight mb-4 uppercase">Estado de la Plataforma</h2>
          <p className="text-slate-400 font-medium mb-8 leading-relaxed">
            Su instancia de DentalSaaS está operando en la versión 2.4.0-pro.
            Todos los servicios de base de datos y mensajería están sincronizados.
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--sb-border)]">Base de Datos OK</span>
             </div>
             <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--sb-border)]">Worker remoción OK</span>
             </div>
          </div>
        </div>
        <Database className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 rotate-12" />
      </motion.div>
    </motion.div>
  );
};
