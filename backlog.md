# Backlog del Proyecto - Odontología

## Análisis Actual (2026-04-26)

### Estado del Backend
- Todos los módulos CRUD están implementados
- Endpoints de archivos, presupuestos, obras Sociales, configuración
- Reminders con cron job pero mock (sin integración WhatsApp real)

### Estado del Frontend
- Web completo con agenda, pacientes, presupuestos, tratamientos
- Módulo obras sociales, dashboard, reminder
- Componentes dead code son versiones antiga/no usadas de componentes ahora integrados en otros archivos

---

## Dead Code del Frontend (componentes alternativos no usados - pueden eliminarse)

| Símbolo | Archivo | Estado | Funcionalidad Principal / Referencia |
|---------|---------|--------|---------------------------------------|
| `AgendaList` | agenda/components/agenda-list.tsx | Alternativa no usada | `CalendarGrid.tsx` (Vista de calendario en `agenda-page.tsx`) |
| `usePresupuestoDetalle` | finanzas/hooks/use-presupuestos.ts | Definido pero no usado | `usePacienteFinanzas` (Usado en `paciente-detalle-page.tsx`) |
| `AntecedentesList` | pacientes/components/antecedentes-list.tsx | Alternativa no usada | `AntecedentesAlerts.tsx` (Integrado en ficha clínica) |
| `EvolucionClinicaList` | pacientes/components/evolucion-clinica-list.tsx | Alternativa no usada | `EvolucionClinicaTimeline.tsx` (Línea de tiempo en ficha) |
| `FichaClinicaCard` | pacientes/components/ficha-clinica-card.tsx | Alternativa no usada | Resumen superior en `paciente-detalle-page.tsx` |
| `UpcomingAppointments` | pacientes/components/upcoming-appointments.tsx | Alternativa no usada | Widget "Agenda Próxima" en `paciente-detalle-page.tsx` |
| `useReminderMutations` | reminders/hooks/use-reminders.ts | Definido pero no usado | `useReminders` (Usado en `reminders-page.tsx`) |
| `useTratamientoUnico` | tratamientos/hooks/use-tratamientos.ts | Definido pero no usado | `useTratamientos` (Usado en ficha de paciente) |
| `setUnauthorizedCallback` | lib/Httpclient.ts | Feature no implementada | T1: Pendiente implementar en `Httpclient.ts` |
| `put` | lib/Httpclient.ts | No implementado | T1: Pendiente implementar en `Httpclient.ts` |

### Componentes alternativos que podrían integrarse
- `usePresupuestoDetalle`: Podría usarse en página de detalle de presupuesto
- `useTratamientoUnico`: Podría usarse para ver un plan específico

---

## Features Pendientes

### 1. recordatorios (HIGH)
**Descripción**: Integrar envío real de recordatorios por WhatsApp
- Backend: `apps/api/src/modules/reminders/reminders.service.ts` tiene `handleCron()` que es mock
- Agregar provider Twilio/Meta Cloud API
- [ ] Configurar Twilio Cloud API
- [ ] Implementar `WhatsAppService` con método `sendMessage(phone, message)`
- [ ] Reemplazar mock en `sendAndSaveReminder()`

**Prioridad**: HIGH

---

### 2. Dashboard Histórico (MEDIUM)
**Descripción**: Agregar datos históricos para gráficos
- Agregar endpoint dashboard con rango de fechas
- [x] Endpoint `/dashboard/historical?from=...&to=...`
- [x] Return por mes: `{ month: string, ingresos: number, tratamientos: number }`
- [x] Usar en frontend para gráficos

**Prioridad**: MEDIUM

---

### 3. Módulo de Reportes (DONE)
**Descripción**: Generar reportes PDF institucionales
- [x] Reporte de cobranzas por período (PDF)
- [x] Reporte de pacientes nuevos por período (PDF)
- [x] Reporte de resumen histórico (PDF)
- [x] Personalización con logo real de la clínica y diseño premium
- Usando `pdfkit` en el Backend para generación segura y centralizada

**Prioridad**: MEDIUM

---

### 4. Notificaciones Push (LOW)
**Descripción**: Notificaciones en tiempo real
- [ ] WebSocket para nuevas alertas
- [ ] Notificaciones de turno confirmado
- [ ] Notificaciones de pago recibido

**Prioridad**: LOW

---

### 5. Multi-tenant / Sucursales (LOW)
**Descripción**: Soporte para múltiples clínicas
- Tabla `sucursales` existe en init.sql pero no se usa
- [ ] Agregar filtro por `sucursal_id` en todas las queries
- [ ] Configuración de clínica por sucursal
- [ ] Switch entre sucursales en UI

**Prioridad**: LOW

---

## Tareas de Implementación

### T1: HttpClient - Implementar put y setUnauthorizedCallback (DONE)
**Archivo**: `apps/web/src/lib/Httpclient.ts`
```
- [x] Agregar método `put<T>(url, data, options?)` que haga request con method: 'PUT'
- [x] Agregar propiedad `unauthorizedCallback: (() => void) | null`
- [x] Agregar método `setUnauthorizedCallback(fn)` para setear el callback
- [x] En el interceptor de response, si 401 y hay callback, invocarlo y limpiar token
```

### T2: Hooks - Integrar usePresupuestoDetalle
**Archivo**: `apps/web/src/features/finanzas/hooks/use-presupuestos.ts`
**Referencia**: Ya existe, solo hay que usarlo
```
- [ ] Importar en presupuestos-page.tsx o crear página de detalle
- [ ] Mostrar detalle del presupuesto con sus pagos
```

### T3: Hooks - Integrar useTratamientoUnico
**Archivo**: `apps/web/src/features/tratamientos/hooks/use-tratamientos.ts`
**Referencia**: Ya existe, solo hay que usarlo
```
- [ ] Crear página de detalle de plan: /tratamientos/:id
- [ ] Usar useTratamientoUnico(id) para cargar datos
```

### T4: Hooks - Eliminar useReminderMutations no usado (DONE)
**Archivo**: `apps/web/src/features/reminders/hooks/use-reminders.ts`
```
- [x] Verificar si se usa en algún componente
- [x] Si no se usa, eliminar (ya existe useReminders con integración)
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

### T6: Backend - Dashboard histórico (DONE)
**Archivos**: `apps/api/src/modules/dashboard/`
```
- [x] Agregar endpoint GET /dashboard/historical?from=&to=
- [x] Devolver array por mes: [{ month, ingresos, tratamientos }]
- [x] Nuevo módulo inyectado en `DashboardModule`
```

### T7: Frontend - Gráficos dashboard (DONE)
**Archivos**: `apps/web/src/features/dashboard/`
```
- [x] Instalar recharts
- [x] Crear componente DashboardChart.tsx
- [x] Llamar /dashboard/historical y renderizar gráfico de barras/líneas
- [x] Implementar selectores de fecha en la UI
```

### T8: Backend - WhatsApp reminders (DONE)
**Archivos**: `apps/api/src/modules/reminders/`
```
- [x] Crear servicio WhatsAppService
- [x] Integrar Twilio SDK (o Meta Cloud API) - Se usó Evolution API via HttpModule
- [x] Configurar credenciales en env
- [x] Reemplazar mock en sendAndSaveReminder()
```

### T9: Reportes PDF (Presupuestos, Cobranza, Pacientes) (DONE)
**Archivos**: `apps/api/src/modules/reports/`, `apps/web/src/features/finanzas/`, `apps/web/src/features/dashboard/`
```
- [x] Implementar PdfService en Backend (usando pdfkit)
- [x] Generar PDF de presupuestos con diseño premium
- [x] Generar PDF de reporte de cobranza por rango de fechas
- [x] Generar PDF de nuevos pacientes por rango de fechas
- [x] Agregar botones de exportación en UI (PresupuestoList y Dashboard)
- [x] Personalización institucional (Header, Footer, Logo vectorial)
```

---

## Bugs / Issues

### Dead Code (ya verificado - no es bug, es正常使用)
| Símbolo | Archivo | Nota |
|---------|---------|------|
| `validate` | jwt.strategy.ts | Usado por NestJS auth guard internamente |
| `listByPaciente` | archivos.controller.ts | Endpoint existe y se usa via archivos-api.ts |
| `getPagos` | presupuestos.controller.ts | Endpoint existe y se usa via finanzas-api.ts |
| `handleCron` | reminders.service.ts | Cron job activo daily at 9AM |

---

## Tech Debt

1. **TypeScript strict**: [DONE] Refactored all modules, entities, and services for `strict: true`. Resolved all compilation errors.
2. **Performance & Database**: [DONE] Added `@Index()` to critical foreign keys and filter columns. Paginación (skip/take) implemented in Patients, Appointments, and Budgets. Caching added for Dashboard routes.
3. **Security (backend-audit-plan)**: [DONE] Implemented `helmet`, `ThrottlerModule` (Rate limiting), and restrictive CORS.
4. **Dead Code Cleanup**: [DONE] Removed unused components and hooks in both Frontend and Backend.
5. **Stability**: [DONE] Validated full build and lint in both applications.

---

## Próximos Pasos (Roadmap 2.0)

### 1. Accesibilidad & UX (T9.2)
- [ ] Auditoría de accesibilidad con `agency-accessibility-auditor`.
- [ ] Implementación de `aria-labels`, roles ARIA y navegación por teclado completa.
- [ ] Mejora de contraste en modo oscuro.

### 2. Notificaciones en Tiempo Real (T10)
- [ ] Implementar WebSockets (Socket.io) para notificaciones push en la campana de la UI.
- [ ] Sincronización de agenda en tiempo real entre múltiples recepcionistas.

### 3. Infraestructura y Despliegue
- [ ] Crear `Dockerfile` multietapa para API y Web.
- [ ] Configurar CI/CD con GitHub Actions para validación automática (Lint/Build).
- [ ] Configurar backups automáticos de la base de datos Postgres.