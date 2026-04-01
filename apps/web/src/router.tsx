import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/app-layout';
import { LoginPage } from './features/auth/pages/login-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page';
import { PacientesPage } from './features/pacientes/pages/pacientes-page';
import { PacienteDetallePage } from './features/pacientes/pages/paciente-detalle-page';
import { AgendaPage } from './features/agenda/pages/agenda-page';
import { OdontogramaPage } from './features/odontograma/pages/odontograma-page';
import { PresupuestosPage } from './features/finanzas/pages/presupuestos-page';
import { useAuth } from './context/auth-context';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'pacientes',
        element: <div>Módulo de Pacientes en construcción</div>,
      },
      {
        path: 'agenda',
        element: <div>Módulo de Agenda en construcción</div>,
      },
      {
        path: 'presupuestos',
        element: <div>Módulo de Presupuestos en construcción</div>,
      },
    ],
  },
]);
