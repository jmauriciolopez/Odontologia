# Plan de Auditoría y Mejora Backend (Seguridad y Rendimiento)

**Fecha de Auditoría:** 2026-04-29
**Herramientas/Agentes:** `agency-security-engineer`, `agency-performance-benchmarker`

## 🛡️ Auditoría de Seguridad (OWASP & Mejores Prácticas)

### Hallazgos y Riesgos
1. **Falta de Rate Limiting (Riesgo: CRÍTICO)**
   - **Problema:** Los endpoints públicos, especialmente `/auth/login`, no tienen limitación de peticiones. Esto expone al sistema a ataques de fuerza bruta y denegación de servicio (DDoS).
   - **Acción:** Instalar e implementar `@nestjs/throttler` de forma global, con reglas estrictas en autenticación.

2. **Ausencia de Cabeceras de Seguridad (Riesgo: ALTO)**
   - **Problema:** No se utiliza `helmet` en `main.ts`. Faltan cabeceras como CSP, HSTS, X-Frame-Options, exponiendo a vulnerabilidades como Clickjacking y XSS.
   - **Acción:** Instalar `helmet` y configurarlo en la inicialización (bootstrap) de la aplicación.

3. **Configuración Permisiva de CORS (Riesgo: MEDIO)**
   - **Problema:** `origin: true` en `main.ts` permite que cualquier origen reflejado consuma la API, lo cual es inseguro en producción.
   - **Acción:** Restringir orígenes permitidos mediante variables de entorno (ej. `CORS_ORIGIN`).

4. **Límites de Payload (Riesgo: BAJO/MEDIO)**
   - **Problema:** No se han configurado límites de tamaño para el cuerpo JSON en express, permitiendo potenciales ataques de agotamiento de memoria.
   - **Acción:** Configurar `body-parser` json/urlencoded limits en `main.ts`.

---

## ⚡ Auditoría de Rendimiento y Escalabilidad

### Hallazgos y Riesgos
1. **Ausencia de Paginación en Endpoints Críticos (Riesgo: CRÍTICO)**
   - **Problema:** Los métodos `findAll` en los servicios de `Pacientes`, `Turnos` y `Presupuestos` (y potencialmente otros) utilizan `getMany()` o `find()` sin parámetros de `limit` (take) ni `offset` (skip). Esto colapsará la memoria a medida que la base de datos crezca.
   - **Acción:** Implementar paginación (preferiblemente basada en cursor o take/skip clásico) y retornar metadatos (`total`, `page`, `limit`).

2. **Carga Excesiva de Relaciones (Over-fetching) (Riesgo: ALTO)**
   - **Problema:** Para listas (ej. en `findAll`), se utilizan `leftJoinAndSelect` que traen toda la estructura del paciente, fichas, obras sociales o turnos anidados sin proyectar las columnas.
   - **Acción:** Utilizar `.select()` en QueryBuilders para traer únicamente los campos requeridos en vistas de lista.

3. **Falta de Caché en Dashboards (Riesgo: MEDIO)**
   - **Problema:** Las estadísticas y el histórico del dashboard realizan cálculos pesados en DB cada vez que se carga la página principal.
   - **Acción:** Implementar `@nestjs/cache-manager` para los resultados del dashboard, reduciendo la carga de base de datos en vistas frecuentes.

4. **Revisión de Índices en Base de Datos (Riesgo: MEDIO)**
   - **Problema:** Consultas frecuentes sobre texto como "buscar paciente por nombre o documento" con `ILIKE` pueden generar "table scans".
   - **Acción:** Validar la existencia de índices B-Tree/GIN en TypeORM para columnas utilizadas intensamente en búsquedas (ej. `documento`, `email`).

---

## 📅 Próximos Pasos (Nuevo Backlog Backend)

Estas tareas se deben agregar a la sección de **Deuda Técnica** del proyecto:

- [x] **T-SEC-1**: Instalar y configurar `helmet` en `main.ts`.
- [x] **T-SEC-2**: Implementar `ThrottlerModule` y proteger rutas sensibles.
- [x] **T-SEC-3**: Ajustar política de CORS basada en entorno.
- [x] **T-PERF-1**: Refactorizar `PacientesService.findAll` para incluir paginación.
- [x] **T-PERF-2**: Refactorizar `TurnosService.findAll` y `PresupuestosService.findAll` con límites por defecto (ej. max 50-100 items).
- [x] **T-PERF-3**: Agregar Caché en memoria para las rutas `GET /dashboard/historical` y `/dashboard/stats`. (DONE)
