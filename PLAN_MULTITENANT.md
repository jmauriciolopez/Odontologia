# Plan de Implementación: Arquitectura Multitenant y Onboarding

Este documento detalla la estrategia para transformar la plataforma en un Software as a Service (SaaS) multi-inquilino, permitiendo que múltiples clínicas operen de forma aislada con un proceso de registro automatizado.

## 1. Arquitectura Multitenant

### Aislamiento de Datos
Se utilizará una **Base de Datos Compartida con Columna Discriminadora** (`clinica_id`).
*   **Eficiencia**: Menor costo de infraestructura y facilidad de mantenimiento.
*   **Seguridad**: Todas las consultas a la base de datos incluirán automáticamente el filtro de la clínica actual.

### Contexto Global (Backend)
*   Integración de `nestjs-cls` para mantener el ID de la clínica durante el ciclo de vida de la petición.
*   Interceptor que extrae el `tenantId` del JWT y lo inyecta en el contexto asíncrono.
*   Uso de filtros globales en TypeORM para forzar `WHERE clinica_id = X` en todas las operaciones.

---

## 2. Flujo de Onboarding (Registro)

### Registro de Nueva Clínica
Se implementará un endpoint público `/onboarding/register` que realizará las siguientes tareas:
1.  Crear el registro de la `Clinica` (Tenant).
2.  Crear el primer `Usuario` (ADMIN) asociado a esa clínica.
3.  Configurar los límites de la prueba (Trial).
4.  Generar datos por defecto (Sede principal, primer profesional).

---

## 3. Estrategia de Prueba (Trial/Demo)

Se aplicará una restricción dual para los nuevos clientes. El sistema detectará automáticamente si se ha superado alguno de los dos límites:

### A. Límite por Tiempo (X Días Libres)
*   Al registrarse, se asigna una fecha `trialExpiresAt` (ej. +30 días).
*   Un `TrialGuard` global bloqueará las operaciones de escritura (crear pacientes, turnos, etc.) una vez pasada esta fecha.

### B. Límite por Volumen (X Pacientes)
*   Configuración de un campo `maxPatients` en la entidad Clínica.
*   Si la clínica alcanza el número máximo de pacientes permitidos en la demo, se le invitará a actualizar su plan para continuar.

---

## 4. Interfaz de Usuario (Frontend)

*   **Página de Sign-Up**: Formulario simplificado para que el dueño de la clínica se registre.
*   **Indicador de Trial**: Barra de progreso o contador en el dashboard mostrando los días restantes o pacientes utilizados.
*   **Modales de Upgrade**: Al intentar realizar una acción bloqueada por el trial, se mostrará un modal estéticamente premium con los planes de pago.

---

## 5. Pasos Técnicos Sugeridos para el Inicio

1.  **Crear Entidad `Clinica`**: Campos `nombre`, `slug`, `trialExpiresAt`, `maxPatients`.
2.  **Migración de Base de Datos**: Añadir `clinica_id` a `BaseEntity` y actualizar tablas existentes.
3.  **Refactor de Auth**: Incluir `clinicaId` en el Payload del Token JWT.
4.  **Implementar `TrialGuard`**: Lógica centralizada para controlar los permisos según el estado de la suscripción.
