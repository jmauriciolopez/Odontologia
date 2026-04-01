import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Pacientes', path: '/pacientes', icon: '👥' },
    { name: 'Agenda', path: '/agenda', icon: '📅' },
    { name: 'Presupuestos', path: '/presupuestos', icon: '💰' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="flex flex-col" style={{ width: '260px', background: 'var(--text-main)', color: 'white', padding: '1.5rem' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🦷</span>
          <h1 style={{ color: 'white', fontSize: '1.25rem' }}>OdontoSaaS</h1>
        </div>

        <nav className="flex flex-col gap-2" style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2`}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)',
                textDecoration: 'none',
                color: location.pathname === item.path ? 'white' : 'var(--text-muted)',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', justifyContent: 'flex-start', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: 'none' }}
          >
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header className="flex items-center justify-between" style={{ height: '70px', padding: '0 2rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.125rem' }}>
            {menuItems.find(i => i.path === location.pathname)?.name || 'Detalle'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.nombre}</span>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{user?.email}</span>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              {user?.nombre?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
