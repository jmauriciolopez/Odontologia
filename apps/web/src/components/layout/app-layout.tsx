import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { useTheme } from '../../context/theme-context';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  LogOut,
  Bell,
  Settings,
  Search,
  Menu,
  Shield,
  Stethoscope,
  MapPin,
  Heart,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandPalette } from './CommandPalette';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Pacientes', path: '/pacientes', icon: Users },
    { name: 'Agenda', path: '/agenda', icon: Calendar },
    { name: 'Recordatorios', path: '/reminders', icon: Bell },
    { name: 'Tratamientos', path: '/tratamientos', icon: Stethoscope },
    { name: 'Presupuestos', path: '/presupuestos', icon: CreditCard },
    { name: 'Usuarios', path: '/usuarios', icon: Shield },
    { name: 'Profesionales', path: '/usuarios/profesionales', icon: Heart },
    { name: 'Consultorios', path: '/usuarios/consultorios', icon: MapPin },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeColor = "text-blue-500 dark:text-blue-400";
  const activeBg = "bg-blue-50/50 dark:bg-blue-500/10";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 transition-all duration-300">
        <div className="flex items-center gap-3 px-8 h-20">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-white">
            <span className="text-xl font-bold">🦷</span>
          </div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-slate-800 dark:text-white">OdontoSaaS</h1>
        </div>

        <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          <div className="space-y-1">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Menú Principal</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative",
                      isActive
                        ? `${activeBg} ${activeColor}`
                        : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <item.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && activeColor)} />
                    <span className="text-sm font-semibold tracking-tight">{item.name}</span>
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
             <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Configuración</h3>
             <Link
               to="/ajustes"
               className={cn(
                 "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                 location.pathname === '/ajustes'
                   ? "bg-primary/10 text-primary"
                   : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
               )}
             >
               <Settings size={20} />
               <span className="text-sm font-semibold tracking-tight">Ajustes</span>
             </Link>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
          <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl p-4 flex items-center justify-between group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden border border-primary/20">
                   {user?.nombre?.charAt(0)}
                </div>
                <div className="flex flex-col truncate max-w-[120px]">
                   <span className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.nombre}</span>
                   <span className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-bold">{user?.rol || 'Doctor'}</span>
                </div>
             </div>
             <button
               onClick={handleLogout}
               className="p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
               title="Cerrar Sesión"
             >
               <LogOut size={18} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 px-8 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button className="lg:hidden p-2 rounded-lg text-slate-500">
               <Menu size={24} />
             </button>
              <div className="relative group hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                 <input
                   type="text"
                   readOnly
                   onClick={() => setIsCommandPaletteOpen(true)}
                   placeholder="Buscar pacientes, turnos... (Ctrl+K)"
                   className="bg-slate-100 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-blue-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm w-96 cursor-pointer outline-none transition-all shadow-sm hover:shadow-md"
                 />
              </div>
          </div>

          <div className="flex items-center gap-3">
             <button
               onClick={toggleTheme}
               className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
               title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
             >
               <AnimatePresence mode="wait" initial={false}>
                 <motion.div
                   key={theme}
                   initial={{ rotate: -90, opacity: 0 }}
                   animate={{ rotate: 0, opacity: 1 }}
                   exit={{ rotate: 90, opacity: 0 }}
                   transition={{ duration: 0.2 }}
                 >
                   {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                 </motion.div>
               </AnimatePresence>
             </button>
             <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900" />
             </button>
             <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
             <div className="flex items-center gap-3 pl-2">
                <div className="hidden sm:flex flex-col items-end">
                   <span className="text-sm font-bold text-slate-900 dark:text-white">Panel de Control</span>
                   <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest leading-none">Administrador</span>
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};
