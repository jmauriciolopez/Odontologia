import React from 'react';
import { Bell, MagnifyingGlass, List, WifiHigh, WifiSlash } from '@phosphor-icons/react';
import ThemeToggle from './ThemeToggle';
import StyleToggle from './StyleToggle';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/notification-context';

interface HeaderProps {
  onSearchClick: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, onMenuClick }) => {
  const navigate = useNavigate();
  const { isConnected } = useNotifications();

  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center justify-between px-8 shrink-0 transition-all duration-300"
      style={{
        background:    'var(--card-bg)',
        borderBottom:  '1px solid var(--sb-border)',
        backdropFilter:'blur(12px)',
      }}
    >
      {/* ... Left side remains same ... */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Abrir menú lateral"
          className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--sb-text-muted)' }}>
          <List size={24} weight="bold" />
        </button>
        <div className="relative group hidden md:block">
          <MagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-500"
            size={18}
            weight="bold"
            style={{ color: 'var(--sb-text-muted)' }}
          />
          <input
            type="text"
            readOnly
            onClick={onSearchClick}
            aria-label="Buscar pacientes, turnos y más"
            placeholder="Buscar pacientes, turnos... (Ctrl+K)"
            className="rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium w-96 cursor-pointer outline-none transition-all shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary"
            style={{
              background: 'var(--sb-active-bg)',
              border:     '1px solid var(--sb-border)',
              color:      'var(--sb-text)',
            }}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <StyleToggle />
        <ThemeToggle />

        <button
          onClick={() => navigate('/reminders')}
          aria-label={isConnected ? "Centro de notificaciones (Conectado)" : "Centro de notificaciones (Desconectado)"}
          className="relative p-2 rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 group"
          style={{ color: isConnected ? 'var(--sb-text)' : 'var(--sb-text-muted)' }}
          title={isConnected ? 'Conectado - Centro de Notificaciones' : 'Desconectado - Reintentando...'}
        >
          <Bell size={20} weight={isConnected ? "fill" : "bold"} className={isConnected ? "animate-pulse-subtle" : ""} />
          {isConnected ? (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] border border-white dark:border-slate-900" />
          ) : (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] border border-white dark:border-slate-900" />
          )}
        </button>

        <div className="h-8 w-px mx-2" style={{ background: 'var(--sb-border)' }} />

        <button 
          className="hidden sm:flex flex-col items-end hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 outline-none"
          aria-label="Perfil de usuario y configuración"
        >
          <span className="text-sm font-bold" style={{ color: 'var(--sb-text)' }}>
            Panel de Control
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-emerald-600 dark:text-emerald-400">
            Administrador
          </span>
        </button>
      </div>
    </header>
  );
};
