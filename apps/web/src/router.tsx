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
import { UsuariosPage } from './features/usuarios/pages/usuarios-page';
import { ConsultoriosPage } from './features/usuarios/pages/consultorios-page';
import { ProfesionalesPage } from './features/usuarios/pages/profesionales-page';
import { AjustesPage } from './features/usuarios/pages/ajustes-page';
import { NomenclaturaPage } from './features/usuarios/pages/nomenclatura-page';
import { RemindersPage } from './features/reminders/pages/reminders-page';
import { TratamientosPage } from './features/tratamientos/pages/tratamientos-page';
import { ObrasSocialesPage } from './features/obras-sociales/pages/obras-sociales-page';
import { useAuth } from './context/auth-context';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <div className="p-8">Cargando aplicación...</div>;
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (!isLoading && token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
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
        children: [
          {
            index: true,
            element: <PacientesPage />,
          },
          {
            path: ':id',
            element: <PacienteDetallePage />,
          },
          {
            path: ':id/odontograma/:fichaId',
            element: <OdontogramaPage />,
          },
        ],
      },
      {
        path: 'agenda',
        element: <AgendaPage />,
      },
      {
        path: 'presupuestos',
        element: <PresupuestosPage />,
      },
      {
        path: 'reminders',
        element: <RemindersPage />,
      },
      {
        path: 'tratamientos',
        element: <TratamientosPage />,
      },
      {
        path: 'obras-sociales',
        element: <ObrasSocialesPage />,
      },
      {
        path: 'ajustes',
        children: [
          {
            index: true,
            element: <AjustesPage />,
          },
          {
            path: 'nomenclatura',
            element: <NomenclaturaPage />,
          },
        ],
      },
      {
        path: 'usuarios',
        children: [
          {
            index: true,
            element: <UsuariosPage />,
          },
          {
            path: 'consultorios',
            element: <ConsultoriosPage />,
          },
          {
            path: 'profesionales',
            element: <ProfesionalesPage />,
          },
        ],
      },
    ],
  },
]);
