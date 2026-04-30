import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/app-layout';
import { useAuth } from './context/auth-context';

// Lazy load components
const LoginPage = lazy(() => import('./features/auth/pages/login-page').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./features/dashboard/pages/dashboard-page').then(m => ({ default: m.DashboardPage })));
const PacientesPage = lazy(() => import('./features/pacientes/pages/pacientes-page').then(m => ({ default: m.PacientesPage })));
const PacienteDetallePage = lazy(() => import('./features/pacientes/pages/paciente-detalle-page').then(m => ({ default: m.PacienteDetallePage })));
const AgendaPage = lazy(() => import('./features/agenda/pages/agenda-page').then(m => ({ default: m.AgendaPage })));
const OdontogramaPage = lazy(() => import('./features/odontograma/pages/odontograma-page').then(m => ({ default: m.OdontogramaPage })));
const PresupuestosPage = lazy(() => import('./features/finanzas/pages/presupuestos-page').then(m => ({ default: m.PresupuestosPage })));
const RemindersPage = lazy(() => import('./features/reminders/pages/reminders-page').then(m => ({ default: m.RemindersPage })));
const TratamientosPage = lazy(() => import('./features/tratamientos/pages/tratamientos-page').then(m => ({ default: m.TratamientosPage })));
const ObrasSocialesPage = lazy(() => import('./features/obras-sociales/pages/obras-sociales-page').then(m => ({ default: m.ObrasSocialesPage })));

// Ajustes & Usuarios
const AjustesPage = lazy(() => import('./features/usuarios/pages/ajustes-page').then(m => ({ default: m.AjustesPage })));
const NomenclaturaPage = lazy(() => import('./features/usuarios/pages/nomenclatura-page').then(m => ({ default: m.NomenclaturaPage })));
const UsuariosPage = lazy(() => import('./features/usuarios/pages/usuarios-page').then(m => ({ default: m.UsuariosPage })));
const ConsultoriosPage = lazy(() => import('./features/usuarios/pages/consultorios-page').then(m => ({ default: m.ConsultoriosPage })));
const ProfesionalesPage = lazy(() => import('./features/usuarios/pages/profesionales-page').then(m => ({ default: m.ProfesionalesPage })));

const PageLoader = () => (
  <div className="flex h-[80vh] w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
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
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
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
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'pacientes',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PacientesPage />
              </Suspense>
            ),
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<PageLoader />}>
                <PacienteDetallePage />
              </Suspense>
            ),
          },
          {
            path: ':id/odontograma/:fichaId',
            element: (
              <Suspense fallback={<PageLoader />}>
                <OdontogramaPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'agenda',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AgendaPage />
          </Suspense>
        ),
      },
      {
        path: 'presupuestos',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PresupuestosPage />
          </Suspense>
        ),
      },
      {
        path: 'reminders',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RemindersPage />
          </Suspense>
        ),
      },
      {
        path: 'tratamientos',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TratamientosPage />
          </Suspense>
        ),
      },
      {
        path: 'obras-sociales',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ObrasSocialesPage />
          </Suspense>
        ),
      },
      {
        path: 'ajustes',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <AjustesPage />
              </Suspense>
            ),
          },
          {
            path: 'nomenclatura',
            element: (
              <Suspense fallback={<PageLoader />}>
                <NomenclaturaPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: 'usuarios',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <UsuariosPage />
              </Suspense>
            ),
          },
          {
            path: 'consultorios',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ConsultoriosPage />
              </Suspense>
            ),
          },
          {
            path: 'profesionales',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfesionalesPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);
