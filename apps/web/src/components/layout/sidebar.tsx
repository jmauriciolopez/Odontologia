import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import {
  SquaresFour,
  Users,
  Calendar,
  CreditCard,
  SignOut,
  Bell,
  Gear,
  Shield,
  Stethoscope,
  MapPin,
  Heart,
  Buildings,
  BookOpen,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard',     path: '/',                       icon: SquaresFour },
  { name: 'Pacientes',     path: '/pacientes',              icon: Users },
  { name: 'Agenda',        path: '/agenda',                 icon: Calendar },
  { name: 'Recordatorios', path: '/reminders',              icon: Bell },
  { name: 'Tratamientos',  path: '/tratamientos',           icon: Stethoscope },
  { name: 'Presupuestos',  path: '/presupuestos',           icon: CreditCard },
  { name: 'Obras Sociales',path: '/obras-sociales',         icon: Buildings },
  { name: 'Usuarios',      path: '/usuarios',               icon: Shield },
  { name: 'Profesionales', path: '/usuarios/profesionales', icon: Heart },
  { name: 'Consultorios',  path: '/usuarios/consultorios',  icon: MapPin },
  { name: 'Nomenclatura',  path: '/ajustes/nomenclatura',   icon: BookOpen },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <aside
      className="hidden lg:flex w-72 flex-col shrink-0 h-full transition-all duration-300"
      style={{
        background:    'var(--sb-bg)',
        color:         'var(--sb-text)',
        borderRight:   '1px solid var(--sb-border)',
        boxShadow:     'var(--sb-shadow)',
        backdropFilter:'blur(var(--sb-glass-blur))',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-8 h-20 shrink-0"
        style={{ borderBottom: '1px solid var(--sb-border)' }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-white">
          <Stethoscope size={24} weight="bold" />
        </div>
        <h1 className="font-heading text-xl font-bold tracking-tighter" style={{ color: 'var(--sb-text)' }}>
          OdontoSaaS
        </h1>
      </div>

      {/* Nav */}
      <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50"
             style={{ color: 'var(--sb-text-muted)' }}>
            Menú Principal
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative no-underline text-sm font-semibold"
                  style={{
                    background: isActive ? 'var(--sb-active-bg)' : 'transparent',
                    color:      isActive ? 'var(--sb-active-text)' : 'var(--sb-text-muted)',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'var(--sb-active-bg)';
                      (e.currentTarget as HTMLElement).style.opacity = '0.7';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }
                  }}
                >
                  <item.icon size={20} weight={isActive ? "fill" : "bold"} className="transition-transform group-hover:scale-110 shrink-0" />
                  <span className="tracking-tight">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50"
             style={{ color: 'var(--sb-text-muted)' }}>
            Configuración
          </p>
          <Link
            to="/ajustes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline text-sm font-semibold"
            style={{
              background: location.pathname === '/ajustes' ? 'var(--sb-active-bg)' : 'transparent',
              color:      location.pathname === '/ajustes' ? 'var(--sb-active-text)' : 'var(--sb-text-muted)',
            }}
          >
            <Gear size={20} weight={location.pathname === '/ajustes' ? "fill" : "bold"} />
            <span>Ajustes</span>
          </Link>
        </div>
      </div>

      {/* User footer */}
      <div className="p-4 shrink-0" style={{ borderTop: '1px solid var(--sb-border)' }}>
        <div
          className="rounded-2xl p-4 flex items-center justify-between transition-all"
          style={{ background: 'var(--sb-active-bg)', border: '1px solid var(--sb-border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
              {user?.nombre?.charAt(0)}
            </div>
            <div className="flex flex-col truncate max-w-[120px]">
              <span className="text-sm font-bold truncate" style={{ color: 'var(--sb-text)' }}>
                {user?.nombre}
              </span>
              <span className="text-[10px] truncate uppercase tracking-wider font-bold opacity-60"
                    style={{ color: 'var(--sb-text-muted)' }}>
                {user?.rol || 'Doctor'}
              </span>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="p-2 rounded-lg transition-colors hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
            style={{ color: 'var(--sb-text-muted)' }}
            title="Cerrar Sesión"
          >
            <SignOut size={18} weight="bold" />
          </button>
        </div>
      </div>
    </aside>
  );
};
