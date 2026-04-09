import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import StyleToggle from './StyleToggle';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearchClick: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick, onMenuClick }) => {
  const navigate = useNavigate();
  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center justify-between px-8 shrink-0 transition-all duration-300"
      style={{
        background:    'var(--card-bg)',
        borderBottom:  '1px solid var(--sb-border)',
        backdropFilter:'blur(12px)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg" style={{ color: 'var(--sb-text-muted)' }}>
          <Menu size={24} />
        </button>
        <div className="relative group hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-500"
            size={18}
            style={{ color: 'var(--sb-text-muted)' }}
          />
          <input
            type="text"
            readOnly
            onClick={onSearchClick}
            placeholder="Buscar pacientes, turnos... (Ctrl+K)"
            className="rounded-xl py-2.5 pl-10 pr-4 text-sm w-96 cursor-pointer outline-none transition-all shadow-sm hover:shadow-md"
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
          className="relative p-2 rounded-xl transition-colors hover:opacity-80"
          style={{ color: 'var(--sb-text-muted)' }}
          title="Recordatorios"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="h-8 w-px mx-2" style={{ background: 'var(--sb-border)' }} />

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold" style={{ color: 'var(--sb-text)' }}>
            Panel de Control
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-emerald-500">
            Administrador
          </span>
        </div>
      </div>
    </header>
  );
};
