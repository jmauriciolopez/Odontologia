# Backlog del Proyecto - OdontologÃ­a

## AnÃ¡lisis Actual (2026-04-26)

### Estado del Backend
- Todos los mÃ³dulos CRUD estÃ¡n implementados
- Endpoints de archivos, presupuestos, obras Sociales, configuraciÃ³n
- Reminders con cron job pero mock (sin integraciÃ³n WhatsApp real)

### Estado del Frontend
- Web completo con agenda, pacientes, presupuestos, tratamientos
- MÃ³dulo obras sociales, dashboard, reminder
- Componentes dead code son versiones antiga/no usadas de componentes ahora integrados en otros archivos

---

## Dead Code del Frontend (componentes alternativos no usados - pueden eliminarse)

| SÃ­mbolo | Archivo | Estado | Funcionalidad Principal / Referencia |
|---------|---------|--------|---------------------------------------|
| `AgendaList` | agenda/components/agenda-list.tsx | Alternativa no usada | `CalendarGrid.tsx` (Vista de calendario en `agenda-page.tsx`) |
| `usePresupuestoDetalle` | finanzas/hooks/use-presupuestos.ts | Definido pero no usado | `usePacienteFinanzas` (Usado en `paciente-detalle-page.tsx`) |
| `AntecedentesList` | pacientes/components/antecedentes-list.tsx | Alternativa no usada | `AntecedentesAlerts.tsx` (Integrado en ficha clÃ­nica) |
| `EvolucionClinicaList` | pacientes/components/evolucion-clinica-list.tsx | Alternativa no usada | `EvolucionClinicaTimeline.tsx` (LÃ­nea de tiempo en ficha) |
| `FichaClinicaCard` | pacientes/components/ficha-clinica-card.tsx | Alternativa no usada | Resumen superior en `paciente-detalle-page.tsx` |
| `UpcomingAppointments` | pacientes/components/upcoming-appointments.tsx | Alternativa no usada | Widget "Agenda PrÃ³xima" en `paciente-detalle-page.tsx` |
| `useReminderMutations` | reminders/hooks/use-reminders.ts | Definido pero no usado | `useReminders` (Usado en `reminders-page.tsx`) |
| `useTratamientoUnico` | tratamientos/hooks/use-tratamientos.ts | Definido pero no usado | `useTratamientos` (Usado en ficha de paciente) |
| `setUnauthorizedCallback` | lib/Httpclient.ts | Feature no implementada | T1: Pendiente implementar en `Httpclient.ts` |
| `put` | lib/Httpclient.ts | No implementado | T1: Pendiente implementar en `Httpclient.ts` |

### Componentes alternativos que podrÃ­an integrarse
- `usePresupuestoDetalle`: PodrÃ­a usarse en pÃ¡gina de detalle de presupuesto
- `useTratamientoUnico`: PodrÃ­a usarse para ver un plan especÃ­fico

---

## Features Pendientes

### 1. recordatorios (HIGH)
**DescripciÃ³n**: Integrar envÃ­o real de recordatorios por WhatsApp
- Backend: `apps/api/src/modules/reminders/reminders.service.ts` tiene `handleCron()` que es mock
- Agregar provider Twilio/Meta Cloud API
- [x] Configurar Twilio Cloud API (Se usÃ³ Evolution API via HttpModule)
- [x] Implementar `WhatsAppService` con mÃ©todo `sendMessage(phone, message)`
- [x] Reemplazar mock en `sendAndSaveReminder()`

**Prioridad**: HIGH

---

### 2. Dashboard HistÃ³rico (MEDIUM)
**DescripciÃ³n**: Agregar datos histÃ³ricos para grÃ¡ficos
- Agregar endpoint dashboard con rango de fechas
- [x] Endpoint `/dashboard/historical?from=...&to=...`
- [x] Return por mes: `{ month: string, ingresos: number, tratamientos: number }`
- [x] Usar en frontend para grÃ¡ficos

**Prioridad**: MEDIUM

---

### 3. MÃ³dulo de Reportes (DONE)
**DescripciÃ³n**: Generar reportes PDF institucionales
- [x] Reporte de cobranzas por perÃ­odo (PDF)
- [x] Reporte de pacientes nuevos por perÃ­odo (PDF)
- [x] Reporte de resumen histÃ³rico (PDF)
- [x] PersonalizaciÃ³n con logo real de la clÃ­nica y diseÃ±o premium
- Usando `pdfkit` en el Backend para generaciÃ³n segura y centralizada

**Prioridad**: MEDIUM

---

### 4. Notificaciones Push (DONE)
**DescripciÃ³n**: Notificaciones en tiempo real
- [x] WebSocket para nuevas alertas
- [x] Notificaciones de turno confirmado
- [x] Notificaciones de pago recibido

**Prioridad**: LOW

---

### 5. Multi-tenant / Sucursales (DONE)
**DescripciÃ³n**: Soporte para mÃºltiples clÃ­nicas con aislamiento de datos garantizado
- [x] Implementar `ClsModule` para contexto de peticiÃ³n
- [x] Agregar `clinicaId` a `BaseEntity` y todas las tablas
- [x] Implementar `TenantHelper` para filtrado automÃ¡tico en queries
- [x] Configurar `TenantSubscriber` para auto-poblaciÃ³n de clÃ­nica
- [x] Validar aislamiento de datos de extremo a extremo (Frontend/Backend)
- [x] Resolver errores de tipado y validar Build/Lint

---

## Tareas de ImplementaciÃ³n

### T1: HttpClient - Implementar put y setUnauthorizedCallback (DONE)
**Archivo**: `apps/web/src/lib/Httpclient.ts`
```
- [x] Agregar mÃ©todo `put<T>(url, data, options?)` que haga request con method: 'PUT'
- [x] Agregar propiedad `unauthorizedCallback: (() => void) | null`
- [x] Agregar mÃ©todo `setUnauthorizedCallback(fn)` para setear el callback
- [x] En el interceptor de response, si 401 y hay callback, invocarlo y limpiar token
```

### T2: Hooks - Integrar usePresupuestoDetalle (DONE)
**Archivo**: `apps/web/src/features/finanzas/hooks/use-presupuestos.ts`
**Referencia**: Ya existe, solo hay que usarlo
```
- [x] Importar en presupuestos-page.tsx o crear pÃ¡gina de detalle
- [x] Mostrar detalle del presupuesto con sus pagos
```

### T3: Hooks - Integrar useTratamientoUnico (DONE)
**Archivo**: `apps/web/src/features/tratamientos/hooks/use-tratamientos.ts`
**Referencia**: Ya existe, solo hay que usarlo
```
- [x] Crear pÃ¡gina de detalle de plan: /tratamientos/:id
- [x] Usar useTratamientoUnico(id) para cargar datos
```

### T4: Hooks - Eliminar useReminderMutations no usado (DONE)
**Archivo**: `apps/web/src/features/reminders/hooks/use-reminders.ts`
```
- [x] Verificar si se usa en algÃºn componente
- [x] Si no se usa, eliminar (ya existe useReminders con integraciÃ³n)
- [x] O integrarlo en reminders-page.tsx
```

### T5: Dead Code - Limpiar componentes no usados (DONE)
**Archivos a eliminar o integrar**:
```
- [x] apps/web/src/features/agenda/components/agenda-list.tsx
- [x] apps/web/src/features/pacientes/components/antecedentes-list.tsx
- [x] apps/web/src/features/pacientes/components/evolucion-clinica-list.tsx
- [x] apps/web/src/features/pacientes/components/ficha-clinica-card.tsx
- [x] apps/web/src/features/pacientes/components/upcoming-appointments.tsx
```

### T6: Backend - Dashboard histÃ³rico (DONE)
**Archivos**: `apps/api/src/modules/dashboard/`
```
- [x] Agregar endpoint GET /dashboard/historical?from=&to=
- [x] Devolver array por mes: [{ month, ingresos, tratamientos }]
- [x] Nuevo mÃ³dulo inyectado en `DashboardModule`
```

### T7: Frontend - GrÃ¡ficos dashboard (DONE)
**Archivos**: `apps/web/src/features/dashboard/`
```
- [x] Instalar recharts
- [x] Crear componente DashboardChart.tsx
- [x] Llamar /dashboard/historical y renderizar grÃ¡fico de barras/lÃ­neas
- [x] Implementar selectores de fecha en la UI
```

### T8: Backend - WhatsApp reminders (DONE)
**Archivos**: `apps/api/src/modules/reminders/`
```
- [x] Crear servicio WhatsAppService
- [x] Integrar Twilio SDK (o Meta Cloud API) - Se usÃ³ Evolution API via HttpModule
- [x] Configurar credenciales en env
- [x] Reemplazar mock en sendAndSaveReminder()
```

### T9: Reportes PDF (Presupuestos, Cobranza, Pacientes) (DONE)
**Archivos**: `apps/api/src/modules/reports/`, `apps/web/src/features/finanzas/`, `apps/web/src/features/dashboard/`
```
- [x] Implementar PdfService en Backend (usando pdfkit)
- [x] Generar PDF de presupuestos con diseÃ±o premium
- [x] Generar PDF de reporte de cobranza por rango de fechas
- [x] Generar PDF de nuevos pacientes por rango de fechas
- [x] Agregar botones de exportaciÃ³n en UI (PresupuestoList y Dashboard)
- [x] PersonalizaciÃ³n institucional (Header, Footer, Logo vectorial)
```

---

## Bugs / Issues

### Dead Code (ya verificado - no es bug, esæ­£å¸¸ä½¿ç”¨)
| SÃ­mbolo | Archivo | Nota |
|---------|---------|------|
| `validate` | jwt.strategy.ts | Usado por NestJS auth guard internamente |
| `listByPaciente` | archivos.controller.ts | Endpoint existe y se usa via archivos-api.ts |
| `getPagos` | presupuestos.controller.ts | Endpoint existe y se usa via finanzas-api.ts |
| `handleCron` | reminders.service.ts | Cron job activo daily at 9AM |

---

## Tech Debt

1. **TypeScript strict**: [DONE] Refactored all modules, entities, and services for `strict: true`. Resolved all compilation errors.
2. **Performance & Database**: [DONE] Added `@Index()` to critical foreign keys and filter columns. PaginaciÃ³n (skip/take) implemented in Patients, Appointments, and Budgets. Caching added for Dashboard routes.
3. **Security (backend-audit-plan)**: [DONE] Implemented `helmet`, `ThrottlerModule` (Rate limiting), and restrictive CORS.
4. **Dead Code Cleanup**: [DONE] Removed unused components and hooks in both Frontend and Backend.
5. **Stability**: [DONE] Validated full build and lint in both applications.

---

## PrÃ³ximos Pasos (Roadmap 2.0)

### 1. Accesibilidad & UX (T9.2)
- [x] AuditorÃ­a de accesibilidad con `agency-accessibility-auditor` (Completada).
- [x] ImplementaciÃ³n de `aria-labels`, roles ARIA y navegaciÃ³n por teclado completa (RemediaciÃ³n finalizada en Agenda, Odontograma, Sidebar y Modales).
- [x] Mejora de contraste en modo oscuro (Validado y corregido en styles.css).

### 2. Notificaciones en Tiempo Real (T10) [DONE]
- [x] Implementar WebSockets (Socket.io) para notificaciones push en la campana de la UI.
- [x] SincronizaciÃ³n de agenda en tiempo real entre mÃºltiples recepcionistas.

### 3. Infraestructura y Despliegue [DONE]
- [x] Crear `Dockerfile` multietapa para API y Web (Verificados y optimizados).
- [x] Configurar CI/CD con GitHub Actions para validaciÃ³n automÃ¡tica (Lint/Build en `.github/workflows/ci.yml`).
- [x] Configurar backups automáticos de la base de datos Postgres (Script scripts/backup-db.ps1 con rotación).
- [x] Validar build y lint sin errores (0 errores, build exitoso en apps/web y apps/api).

### 4. Onboarding y Multi-tenancy [DONE] (Inc. SubscriptionGuard & UI)
- [x] Crear entidad Clinica con trial y lmites.
- [x] Implementar ClinicasModule y ClinicasService.
- [x] Implementar Auth.register para creacin de clnica + administrador.
- [x] Crear RegisterPage y hook useRegister en el frontend.
- [x] Integrar ruta /register en el router y link en LoginPage.
- [x] Validar build y lint exitoso en ambos mdulos.
