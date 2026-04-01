import React from 'react';
import { useAuth } from '../../../context/auth-context';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Pacientes', value: '1,240', change: '+12%', icon: '👥' },
    { label: 'Turnos Hoy', value: '18', change: '-2%', icon: '📅' },
    { label: 'Facturación Mes', value: '$45,200', change: '+8%', icon: '💰' },
    { label: 'Pendientes', value: '5', change: '', icon: '🔔' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 style={{ fontSize: '1.75rem' }}>Hola, {user?.nombre || 'Doc'} 👋</h1>
        <p className="text-muted">Esto es lo que está pasando en su clínica hoy.</p>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div style={{ fontSize: '2rem', padding: '0.75rem', background: 'var(--bg-app)', borderRadius: '1rem' }}>
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-muted" style={{ fontSize: '0.875rem' }}>{stat.label}</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</span>
                {stat.change && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.125rem 0.375rem', 
                    borderRadius: '1rem', 
                    background: stat.change.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: stat.change.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 600
                  }}>
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Próximos Turnos</h3>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between" style={{ paddingBottom: '1rem', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                  <div className="flex flex-col">
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Paciente {i}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Limpieza Dental</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>09:30 AM</span>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Cons. 1</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Actividad Reciente</h3>
          <p className="text-muted">No hay actividad reciente para mostrar.</p>
        </div>
      </div>
    </div>
  );
};
