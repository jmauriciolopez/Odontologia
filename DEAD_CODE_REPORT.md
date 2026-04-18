# Dead Code Analysis Report - User-Directed Cleanup

Este reporte contiene la lista de 86 candidatos a código muerto detectados en el monorepo. Puedes usar esta lista para dirigir la limpieza selectiva.

## 🔴 Alta Confianza (Componentes Reemplazados o DTOs Huérfanos)

Símbolos exportados que no tienen importaciones ni menciones en el resto del monorepo.

### 📦 Backend (apps/api)
- `UploadDocumentoDto` | `apps/api/src/modules/archivos/dto/upload-archivo.dto.ts`
- `UploadRadiografiaDto` | `apps/api/src/modules/archivos/dto/upload-archivo.dto.ts`
- `ColoresEstadosDto` | `apps/api/src/modules/configuracion/dto/configuracion.dto.ts`
- `UpsertPrestacionPrecioDto` | `apps/api/src/modules/obras-sociales/dto/obras-sociales.dto.ts`
- `PlanTratamientoItemDto` | `apps/api/src/modules/planes-tratamiento/dto/plan-tratamiento.dto.ts`
- `PresupuestoItemDto` | `apps/api/src/modules/presupuestos/dto/presupuesto.dto.ts`
- `seedNomenclador` | `apps/api/src/database/seed-nomenclador.ts`

### 💻 Web Frontend (apps/web)
- `AgendaList` | `apps/web/src/features/agenda/components/agenda-list.tsx`
- `ObraSocialModal` | `apps/web/src/features/obras-sociales/pages/obras-sociales-page.tsx`
- `PreciosModal` | `apps/web/src/features/obras-sociales/pages/obras-sociales-page.tsx`
- `ClonarModal` | `apps/web/src/features/obras-sociales/pages/obras-sociales-page.tsx`
- `AntecedentesList` | `apps/web/src/features/pacientes/components/antecedentes-list.tsx`
- `EvolucionClinicaList` | `apps/web/src/features/pacientes/components/evolucion-clinica-list.tsx`
- `FichaClinicaCard` | `apps/web/src/features/pacientes/components/ficha-clinica-card.tsx`
- `UpcomingAppointments` | `apps/web/src/features/pacientes/components/upcoming-appointments.tsx`
- `PremiumStatCard` | `apps/web/src/features/pacientes/components/DocumentosPanel.tsx`
- `usePresupuestoDetalle` | `apps/web/src/features/finanzas/hooks/use-presupuestos.ts`
- `useTratamientoUnico` | `apps/web/src/features/tratamientos/hooks/use-tratamientos.ts`

### 📱 Mobile (apps/mobile)
- `loadSession` | `apps/mobile/src/context/auth-context.tsx`
- `fetchTurnos` | `apps/mobile/src/screens/dashboard-screen.tsx`
- `fetchPacientes` | `apps/mobile/src/screens/pacientes-screen.tsx`

---

## 📋 Lista Completa de Candidatos (86 ítems)

| Símbolo | Ruta del Archivo |
|---------|------------------|
| `UploadDocumentoDto` | `apps/api/src/modules/archivos/dto/upload-archivo.dto.ts` |
| `UploadRadiografiaDto` | `apps/api/src/modules/archivos/dto/upload-archivo.dto.ts` |
| `ColoresEstadosDto` | `apps/api/src/modules/configuracion/dto/configuracion.dto.ts` |
| `UpsertPrestacionPrecioDto` | `apps/api/src/modules/obras-sociales/dto/obras-sociales.dto.ts` |
| `PlanTratamientoItemDto` | `apps/api/src/modules/planes-tratamiento/dto/plan-tratamiento.dto.ts` |
| `PresupuestoItemDto` | `apps/api/src/modules/presupuestos/dto/presupuesto.dto.ts` |
| `HttpClient` | `apps/web/src/lib/Httpclient.ts` |
| `seedNomenclador` | `apps/api/src/database/seed-nomenclador.ts` |
| `seed` | `apps/api/src/database/seed.ts` (Entry Point) |
| `bootstrap` | `apps/api/src/main.ts` (Entry Point) |
| `loadSession` | `apps/mobile/src/context/auth-context.tsx` |
| `fetchTurnos` | `apps/mobile/src/screens/dashboard-screen.tsx` |
| `onRefresh` | `apps/mobile/src/screens/dashboard-screen.tsx` |
| `renderTurno` | `apps/mobile/src/screens/dashboard-screen.tsx` |
| `handleLogin` | `apps/mobile/src/screens/login-screen.tsx` |
| `fetchPacientes` | `apps/mobile/src/screens/pacientes-screen.tsx` |
| `handleSearch` | `apps/mobile/src/screens/pacientes-screen.tsx` |
| `renderPaciente` | `apps/mobile/src/screens/pacientes-screen.tsx` |
| `handleSelect` | `apps/web/src/components/layout/CommandPalette.tsx` |
| `initAuth` | `apps/web/src/context/auth-context.tsx` |
| `getInitialTheme` | `apps/web/src/context/theme-context.tsx` |
| `applyTheme` | `apps/web/src/context/theme-context.tsx` |
| `layoutOverlapsForDay` | `apps/web/src/features/agenda/components/CalendarGrid.tsx` |
| `getLabel` | `apps/web/src/features/agenda/components/CalendarHeader.tsx` |
| `AgendaList` | `apps/web/src/features/agenda/components/agenda-list.tsx` |
| `cerrar` | `apps/web/src/features/agenda/components/turno-form-modal.tsx` |
| `seleccionarPaciente` | `apps/web/src/features/agenda/components/turno-form-modal.tsx` |
| `limpiarPaciente` | `apps/web/src/features/agenda/components/turno-form-modal.tsx` |
| `handleFechaInicioChange` | `apps/web/src/features/agenda/components/turno-form-modal.tsx` |
| `check` | `apps/web/src/features/agenda/hooks/use-disponibilidad.ts` |
| `handleSelectPlan` | `apps/web/src/features/finanzas/components/presupuesto-form.tsx` |
| `getStatusConfig` | `apps/web/src/features/finanzas/components/presupuesto-list.tsx` |
| `usePresupuestoDetalle` | `apps/web/src/features/finanzas/hooks/use-presupuestos.ts` |
| `invalidate` | `apps/web/src/features/obras-sociales/hooks/use-obras-sociales.ts` |
| `ObraSocialModal` | `apps/web/src/features/obras-sociales/pages/obras-sociales-page.tsx` |
| `PreciosModal` | `apps/web/src/features/obras-sociales/pages/obras-sociales-page.tsx` |
| `ClonarModal` | `apps/web/src/features/obras-sociales/pages/obras-sociales-page.tsx` |
| `handleMarkAusente` | `apps/web/src/features/odontograma/components/OdontogramaManager.tsx` |
| `handleMarkSano` | `apps/web/src/features/odontograma/components/OdontogramaManager.tsx` |
| `handleUpdateCara` | `apps/web/src/features/odontograma/components/OdontogramaManager.tsx` |
| `getFaceColor` | `apps/web/src/features/odontograma/components/Tooth3D.tsx` |
| `getColor` | `apps/web/src/features/odontograma/components/pieza-dental-svg.tsx` |
| `handleCaraClick` | `apps/web/src/features/odontograma/components/pieza-dental-svg.tsx` |
| `handleFileUpload` | `apps/web/src/features/pacientes/components/DocumentosPanel.tsx` |
| `PremiumStatCard` | `apps/web/src/features/pacientes/components/DocumentosPanel.tsx` |
| `safeDate` | `apps/web/src/features/pacientes/components/EvolucionClinicaTimeline.tsx` |
| `formatDate` | `apps/web/src/features/pacientes/components/EvolucionClinicaTimeline.tsx` |
| `formatTime` | `apps/web/src/features/pacientes/components/EvolucionClinicaTimeline.tsx` |
| `applyTemplate` | `apps/web/src/features/pacientes/components/EvolucionClinicaTimeline.tsx` |
| `getCategoryColor` | `apps/web/src/features/pacientes/components/EvolucionClinicaTimeline.tsx` |
| `getMedicion` | `apps/web/src/features/pacientes/components/PeriodontogramaManager.tsx` |
| `handleInputChange` | `apps/web/src/features/pacientes/components/PeriodontogramaManager.tsx` |
| `PerioInput` | `apps/web/src/features/pacientes/components/PeriodontogramaManager.tsx` |
| `commit` | `apps/web/src/features/pacientes/components/PeriodontogramaManager.tsx` |
| `AntecedentesList` | `apps/web/src/features/pacientes/components/antecedentes-list.tsx` |
| `EvolucionClinicaList` | `apps/web/src/features/pacientes/components/evolucion-clinica-list.tsx` |
| `FichaClinicaCard` | `apps/web/src/features/pacientes/components/ficha-clinica-card.tsx` |
| `Field` | `apps/web/src/features/pacientes/components/paciente-form.tsx` |
| `handleFormSubmit` | `apps/web/src/features/pacientes/components/paciente-form.tsx` |
| `UpcomingAppointments` | `apps/web/src/features/pacientes/components/upcoming-appointments.tsx` |
| `handler` | `apps/web/src/features/pacientes/pages/paciente-detalle-page.tsx` |
| `handleAddEvolucion` | `apps/web/src/features/pacientes/pages/paciente-detalle-page.tsx` |
| `calculateAge` | `apps/web/src/features/pacientes/pages/paciente-detalle-page.tsx` |
| `useReminderMutations` | `apps/web/src/features/reminders/hooks/use-reminders.ts` |
| `getStatusIcon` | `apps/web/src/features/reminders/pages/reminders-page.tsx` |
| `handleSelectPrestacion` | `apps/web/src/features/tratamientos/components/nuevo-plan-modal.tsx` |
| `useTratamientoUnico` | `apps/web/src/features/tratamientos/hooks/use-tratamientos.ts` |
| `handleDayToggle` | `apps/web/src/features/usuarios/pages/consultorios-page.tsx` |
| `handleOpenHonorario` | `apps/web/src/features/usuarios/pages/nomenclatura-page.tsx` |
| `handleSaveHonorario` | `apps/web/src/features/usuarios/pages/nomenclatura-page.tsx` |
| `fetchData` | `apps/web/src/features/usuarios/pages/nomenclatura-page.tsx` |
| `handleUpdateConfig` | `apps/web/src/features/usuarios/pages/nomenclatura-page.tsx` |
| `handleSavePrestacion` | `apps/web/src/features/usuarios/pages/nomenclatura-page.tsx` |
| `handleSaveOsPrecios` | `apps/web/src/features/usuarios/pages/nomenclatura-page.tsx` |
| `EditProfesionalModal` | `apps/web/src/features/usuarios/pages/profesionales-page.tsx` |
| `handleClose` | `apps/web/src/features/usuarios/pages/usuarios-page.tsx` |
| `handleOpenPw` | `apps/web/src/features/usuarios/pages/usuarios-page.tsx` |
| `handleClosePw` | `apps/web/src/features/usuarios/pages/usuarios-page.tsx` |
| `handleSavePw` | `apps/web/src/features/usuarios/pages/usuarios-page.tsx` |
| `@keyframes ...` | `apps/web/src/styles.css` (CSS Animations) |

---
**Nota**: Algunos ítems (como `@keyframes` o `bootstrap`) son falsos positivos estructurales y deben ser ignorados durante la limpieza.
