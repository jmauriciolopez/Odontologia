# Sesión completa — SaaS de gestión clínica odontológica

## Cómo usar esta sesión

- Ejecutá los prompts **en orden**.
- Pegá **un prompt por vez** en tu IDE AI (Antigravity o similar).
- **No mezcles etapas**.
- Si el IDE rompe consistencia, usá el prompt de **corrección de rumbo** antes de seguir.
- Cada prompt está pensado para **continuar sobre lo ya generado**, sin rehacer todo.
- Objetivo: código **productivo, modular, consistente y escalable**.

---

## 0) Prompt maestro — contexto completo del sistema

Copiá este prompt al inicio de la sesión para fijar el marco general del proyecto.

```md
Actuá como un arquitecto de software senior y product builder especializado en SaaS verticales. Vas a construir un sistema real, orientado a producción, de gestión clínica odontológica.

# Objetivo
Construir un sistema end-to-end con:
- Backend en NestJS
- Frontend en React + TypeScript
- App móvil en React Native con Expo
- Base de datos PostgreSQL
- Auth JWT
- Arquitectura preparada para escalar
- Soporte de adjuntos e imágenes
- Preparación para multi-profesional y multi-sucursal futura

# Reglas obligatorias
- Generá código real, no pseudo-código.
- No expliques teoría salvo comentarios breves dentro del código.
- No rehagas archivos ya existentes salvo que sea estrictamente necesario.
- Respetá naming consistente en toda la base.
- Mantené separación clara entre dominio, aplicación e infraestructura cuando aplique.
- Todo debe quedar listo para continuar en la siguiente etapa.
- Cuando generes archivos, listalos explícitamente.
- Si una etapa depende de otra, asumí que la etapa anterior ya fue creada.
- No uses mocks innecesarios si ya existe backend o base real.
- Usá TypeScript estricto.
- Escribí código orientado a producción.

# Dominio del sistema
SaaS de gestión clínica odontológica para:
- odontólogos
- recepcionistas
- asistentes
- administradores de clínicas

# Problemas a resolver
- fichas clínicas en papel o desorganizadas
- mala accesibilidad a antecedentes, radiografías y documentos
- falta de visualización clara del estado dental
- superposición de turnos
- ausentismo por falta de recordatorios
- poco seguimiento de tratamientos y presupuestos
- mala trazabilidad clínica y financiera

# Funcionalidades núcleo
- pacientes
- ficha clínica
- antecedentes
- radiografías
- documentos adjuntos
- odontograma dinámico
- piezas dentales
- tratamientos asociados a piezas
- plan de tratamiento
- presupuestos
- pagos parciales
- agenda de turnos con disponibilidad real
- profesionales
- consultorios
- recordatorios mockeados
- evolución clínica
- auth JWT con roles

# Entidades principales
- paciente
- ficha_clinica
- antecedente
- documento_adjunto
- radiografia
- odontograma
- pieza_dental
- tratamiento
- plan_tratamiento
- presupuesto
- pago
- turno
- profesional
- consultorio
- usuario
- rol
- recordatorio
- evolucion_clinica
- sucursal (preparada aunque mínima)

# Requisitos importantes
- El odontograma es una pieza central del sistema.
- Debe existir relación entre pieza dental y tratamientos.
- La agenda debe validar conflictos de horario por profesional y consultorio.
- Preparar tenant_id / sucursal_id aunque multi-sucursal pueda quedar simple en esta versión.
- Pagos parciales sobre presupuestos.
- Historial clínico trazable.
- Adjuntos e imágenes preparados para almacenamiento local abstraído, compatible con futura migración a S3.
- Recordatorios preparados como servicio desacoplado, inicialmente mock.

# Stack
Backend:
- NestJS
- TypeORM
- PostgreSQL
- JWT
- class-validator

Frontend web:
- React
- TypeScript
- React Router
- TanStack Query
- React Hook Form
- Zod
- CSS modular o Tailwind, pero mantener consistencia

Mobile:
- React Native
- Expo
- TypeScript
- React Navigation
- TanStack Query

# Convenciones
- idioma del negocio y nombres de módulos: español consistente
- nombres técnicos de clases/archivos: kebab-case para archivos, PascalCase para clases, camelCase para variables
- endpoints REST consistentes
- DTOs separados
- módulos Nest por dominio
- componentes frontend desacoplados por feature

# Estructura objetivo del monorepo
/apps
  /api
  /web
  /mobile
/packages
  /shared-types
  /ui (opcional simple)

# Entregables esperados en esta sesión completa
- esquema SQL inicial y consistente
- backend NestJS modular
- frontend React funcional
- mobile Expo funcional
- auth JWT con roles
- agenda
- odontograma
- presupuestos y pagos
- recordatorios mock
- refactor final

A partir de ahora, en cada etapa generá exactamente lo pedido, indicando archivos exactos a crear o modificar, sin reescribir todo el proyecto.
```

---

## Orden recomendado de ejecución

1. Estructura del monorepo
2. SQL inicial + decisiones de persistencia
3. Bootstrap del backend NestJS
4. Auth JWT + usuarios + roles
5. Módulo de pacientes + ficha clínica
6. Adjuntos, radiografías y almacenamiento local abstracto
7. Profesionales, consultorios y agenda
8. Validación de disponibilidad y conflictos de turnos
9. Odontograma: modelo backend + APIs
10. Web: shell, auth y layout
11. Web: pacientes + ficha clínica
12. Web: agenda
13. Web: odontograma interactivo
14. Web: presupuestos y pagos
15. Mobile: auth + agenda + pacientes
16. Servicio de recordatorios mock + jobs preparados
17. Hardening + refactor final + checklist productivo

---

## 1) Prompt — estructura inicial del monorepo

```md
Tomando el contexto ya definido, generá la estructura inicial del proyecto como monorepo.

Objetivo: dejar una base limpia para apps api, web y mobile, con shared-types.

Generá únicamente:
- árbol de carpetas final
- package.json raíz con workspaces
- tsconfig.base.json
- .editorconfig
- .gitignore
- .env.example raíz
- README.md corto con comandos de instalación y ejecución
- package.json para apps/api
- package.json para apps/web
- package.json para apps/mobile
- package.json para packages/shared-types

Requisitos:
- usar npm workspaces
- TypeScript estricto
- scripts consistentes para dev, build, lint y test
- no agregar herramientas innecesarias
- dejar preparado el proyecto para NestJS, React Vite y Expo

Entregá:
1. lista exacta de archivos creados
2. contenido completo de cada archivo
3. sin explicaciones largas
```

---

## 2) Prompt — SQL inicial PostgreSQL

```md
Sobre la estructura ya creada, generá el esquema SQL inicial para PostgreSQL del SaaS odontológico.

Generá un archivo:
- apps/api/database/init.sql

Incluir:
- extensiones útiles si corresponden
- tablas con PK UUID
- timestamps created_at, updated_at
- deleted_at donde tenga sentido
- tenant_id preparado
- sucursal_id preparado donde aplique
- usuarios, roles, usuario_roles
- profesionales
- consultorios
- pacientes
- fichas_clinicas
- antecedentes
- documentos_adjuntos
- radiografias
- odontogramas
- piezas_dentales
- tratamientos
- planes_tratamiento
- plan_tratamiento_items
- presupuestos
- presupuesto_items
- pagos
- turnos
- recordatorios
- evoluciones_clinicas

Reglas de modelado:
- consistencia en FKs
- índices para búsquedas frecuentes
- unique constraints razonables
- enum tables o check constraints para estados importantes
- pagos parciales sobre presupuesto
- turnos con fecha_inicio y fecha_fin
- tratamientos asociados opcionalmente a pieza dental
- radiografías y adjuntos vinculables a paciente y/o ficha clínica
- odontograma vinculado a paciente

Además generá:
- apps/api/database/seed.sql

El seed debe incluir:
- 1 tenant demo
- 1 sucursal demo
- roles base: admin, odontologo, recepcionista, asistente
- 1 usuario admin
- 2 profesionales
- 2 consultorios
- 3 pacientes demo
- 1 odontograma demo con piezas base mínimas

Entregá solo:
1. lista de archivos
2. contenido completo
3. SQL ejecutable, sin pseudo-código
```

---

## 3) Prompt — bootstrap del backend NestJS

```md
Usando el monorepo existente y el SQL ya definido, generá el bootstrap completo del backend en apps/api usando NestJS.

Generá únicamente estos archivos base:
- apps/api/src/main.ts
- apps/api/src/app.module.ts
- apps/api/src/config/env.ts
- apps/api/src/config/typeorm.config.ts
- apps/api/src/common/entities/base.entity.ts
- apps/api/src/common/interfaces/jwt-payload.interface.ts
- apps/api/src/common/decorators/current-user.decorator.ts
- apps/api/src/common/filters/http-exception.filter.ts
- apps/api/src/common/interceptors/transform-response.interceptor.ts
- apps/api/src/common/guards/jwt-auth.guard.ts
- apps/api/src/common/guards/roles.guard.ts
- apps/api/src/common/decorators/roles.decorator.ts
- apps/api/src/common/constants/roles.constants.ts

Además:
- definir AppModule con TypeORM
- usar variables de entorno
- habilitar ValidationPipe global
- CORS configurable
- prefijo global /api/v1
- estructura lista para módulos por dominio

No generes todavía todos los módulos de negocio.
Sí dejá el backend arrancable.

Entregá:
1. archivos creados
2. contenido completo
3. imports correctos y consistentes
```

---

## 4) Prompt — auth JWT + usuarios + roles

```md
Continuando sobre el backend NestJS ya iniciado, generá el módulo completo de autenticación y autorización con JWT.

Generá estos archivos:
- apps/api/src/modules/auth/auth.module.ts
- apps/api/src/modules/auth/auth.controller.ts
- apps/api/src/modules/auth/auth.service.ts
- apps/api/src/modules/auth/strategies/jwt.strategy.ts
- apps/api/src/modules/auth/dto/login.dto.ts
- apps/api/src/modules/auth/dto/login-response.dto.ts
- apps/api/src/modules/usuarios/usuarios.module.ts
- apps/api/src/modules/usuarios/usuarios.service.ts
- apps/api/src/modules/usuarios/usuarios.controller.ts
- apps/api/src/modules/usuarios/entities/usuario.entity.ts
- apps/api/src/modules/usuarios/entities/rol.entity.ts
- apps/api/src/modules/usuarios/entities/usuario-rol.entity.ts
- apps/api/src/modules/usuarios/dto/create-usuario.dto.ts
- apps/api/src/modules/usuarios/dto/update-usuario.dto.ts
- apps/api/src/modules/usuarios/dto/usuario-response.dto.ts

Requisitos:
- login con email + password
- password con hash usando bcrypt
- endpoint para crear usuario
- endpoint para listar usuarios
- roles por usuario
- guard JWT funcional
- guard de roles funcional
- excluir password_hash en respuestas
- usar entidades TypeORM consistentes con init.sql
- no duplicar lógica de acceso a usuario

Además actualizá solo lo necesario en:
- apps/api/src/app.module.ts

Entregá:
1. archivos creados/modificados
2. contenido completo
3. endpoints listos para probar
```

---

## 5) Prompt — pacientes + ficha clínica + antecedentes + evolución

```md
Sobre el backend existente, generá el dominio clínico inicial para pacientes y fichas clínicas.

Generá estos archivos:
- apps/api/src/modules/pacientes/pacientes.module.ts
- apps/api/src/modules/pacientes/pacientes.controller.ts
- apps/api/src/modules/pacientes/pacientes.service.ts
- apps/api/src/modules/pacientes/entities/paciente.entity.ts
- apps/api/src/modules/pacientes/dto/create-paciente.dto.ts
- apps/api/src/modules/pacientes/dto/update-paciente.dto.ts
- apps/api/src/modules/pacientes/dto/paciente-filtros.dto.ts
- apps/api/src/modules/fichas-clinicas/fichas-clinicas.module.ts
- apps/api/src/modules/fichas-clinicas/fichas-clinicas.controller.ts
- apps/api/src/modules/fichas-clinicas/fichas-clinicas.service.ts
- apps/api/src/modules/fichas-clinicas/entities/ficha-clinica.entity.ts
- apps/api/src/modules/fichas-clinicas/entities/antecedente.entity.ts
- apps/api/src/modules/fichas-clinicas/entities/evolucion-clinica.entity.ts
- apps/api/src/modules/fichas-clinicas/dto/create-ficha-clinica.dto.ts
- apps/api/src/modules/fichas-clinicas/dto/update-ficha-clinica.dto.ts
- apps/api/src/modules/fichas-clinicas/dto/create-antecedente.dto.ts
- apps/api/src/modules/fichas-clinicas/dto/create-evolucion-clinica.dto.ts

Requisitos:
- CRUD de pacientes
- búsqueda de pacientes por nombre, documento y teléfono
- ficha clínica 1 a 1 con paciente
- antecedentes múltiples
- evolución clínica múltiple ordenada por fecha descendente
- endpoints para obtener paciente con ficha, antecedentes y evolución
- validaciones con class-validator
- soft delete solo donde tenga sentido

Actualizá solo lo necesario en:
- apps/api/src/app.module.ts

Entregá código completo, listo para compilar.
```

---

## 6) Prompt — adjuntos, radiografías y almacenamiento local abstracto

```md
Continuando el backend, generá el módulo de archivos para documentos adjuntos y radiografías.

Generá estos archivos:
- apps/api/src/modules/archivos/archivos.module.ts
- apps/api/src/modules/archivos/archivos.controller.ts
- apps/api/src/modules/archivos/archivos.service.ts
- apps/api/src/modules/archivos/storage/storage.interface.ts
- apps/api/src/modules/archivos/storage/local-storage.service.ts
- apps/api/src/modules/archivos/entities/documento-adjunto.entity.ts
- apps/api/src/modules/archivos/entities/radiografia.entity.ts
- apps/api/src/modules/archivos/dto/upload-archivo.dto.ts
- apps/api/src/modules/archivos/dto/archivo-response.dto.ts

Requisitos:
- usar multer en NestJS
- guardar archivos localmente en una carpeta configurable
- abstraer el storage para futura migración a S3
- endpoint para subir documento adjunto de paciente
- endpoint para subir radiografía de paciente
- endpoint para listar archivos por paciente
- endpoint para eliminar lógicamente registros si aplica
- validar tipo MIME básico y tamaño máximo configurable
- persistir metadata: nombre original, mime_type, size_bytes, path, uploaded_by

Además actualizá solo lo necesario en:
- apps/api/src/app.module.ts
- apps/api/src/config/env.ts

Entregá contenido completo de cada archivo y nada de teoría.
```

---

## 7) Prompt — profesionales, consultorios y agenda de turnos

```md
Generá el módulo de agenda con profesionales, consultorios y turnos.

Archivos a crear:
- apps/api/src/modules/profesionales/profesionales.module.ts
- apps/api/src/modules/profesionales/profesionales.controller.ts
- apps/api/src/modules/profesionales/profesionales.service.ts
- apps/api/src/modules/profesionales/entities/profesional.entity.ts
- apps/api/src/modules/profesionales/dto/create-profesional.dto.ts
- apps/api/src/modules/profesionales/dto/update-profesional.dto.ts
- apps/api/src/modules/consultorios/consultorios.module.ts
- apps/api/src/modules/consultorios/consultorios.controller.ts
- apps/api/src/modules/consultorios/consultorios.service.ts
- apps/api/src/modules/consultorios/entities/consultorio.entity.ts
- apps/api/src/modules/consultorios/dto/create-consultorio.dto.ts
- apps/api/src/modules/consultorios/dto/update-consultorio.dto.ts
- apps/api/src/modules/turnos/turnos.module.ts
- apps/api/src/modules/turnos/turnos.controller.ts
- apps/api/src/modules/turnos/turnos.service.ts
- apps/api/src/modules/turnos/entities/turno.entity.ts
- apps/api/src/modules/turnos/dto/create-turno.dto.ts
- apps/api/src/modules/turnos/dto/update-turno.dto.ts
- apps/api/src/modules/turnos/dto/turno-filtros.dto.ts

Requisitos:
- CRUD de profesionales
- CRUD de consultorios
- CRUD de turnos
- estados de turno: programado, confirmado, atendido, cancelado, ausente
- filtros por fecha, profesional, paciente y estado
- relaciones consistentes con paciente, profesional y consultorio
- no permitir crear turnos con fin menor o igual al inicio
- preparar servicio para validación de conflictos en la próxima etapa

Actualizá AppModule solo con lo necesario.
```

---

## 8) Prompt — validación de disponibilidad y conflictos de agenda

```md
Sobre el módulo de turnos ya existente, implementá validación real de disponibilidad.

No rehagas el módulo completo. Modificá solo lo necesario.

Objetivo:
- evitar superposición de turnos por profesional
- evitar superposición de turnos por consultorio
- permitir ignorar un turno al editarlo
- exponer endpoint de disponibilidad

Archivos a crear o modificar:
- apps/api/src/modules/turnos/turnos.service.ts
- apps/api/src/modules/turnos/turnos.controller.ts
- apps/api/src/modules/turnos/dto/disponibilidad-query.dto.ts
- apps/api/src/modules/turnos/interfaces/disponibilidad-response.interface.ts

Requisitos:
- validar solapamiento usando rangos fecha_inicio / fecha_fin
- considerar solo estados activos que bloquean agenda
- endpoint GET /turnos/disponibilidad
- respuesta clara con available true/false y conflictos detectados
- usar QueryBuilder de TypeORM si mejora claridad
- mantener código limpio y productivo

Entregá solo archivos finales completos.
```

---

## 9) Prompt — odontograma backend + tratamientos + planes + presupuestos + pagos

```md
Generá el núcleo clínico-financiero restante del backend, centrado en odontograma y tratamientos.

Archivos a crear:
- apps/api/src/modules/odontograma/odontograma.module.ts
- apps/api/src/modules/odontograma/odontograma.controller.ts
- apps/api/src/modules/odontograma/odontograma.service.ts
- apps/api/src/modules/odontograma/entities/odontograma.entity.ts
- apps/api/src/modules/odontograma/entities/pieza-dental.entity.ts
- apps/api/src/modules/odontograma/entities/tratamiento.entity.ts
- apps/api/src/modules/odontograma/dto/update-pieza-dental.dto.ts
- apps/api/src/modules/odontograma/dto/create-tratamiento.dto.ts
- apps/api/src/modules/planes-tratamiento/planes-tratamiento.module.ts
- apps/api/src/modules/planes-tratamiento/planes-tratamiento.controller.ts
- apps/api/src/modules/planes-tratamiento/planes-tratamiento.service.ts
- apps/api/src/modules/planes-tratamiento/entities/plan-tratamiento.entity.ts
- apps/api/src/modules/planes-tratamiento/entities/plan-tratamiento-item.entity.ts
- apps/api/src/modules/planes-tratamiento/dto/create-plan-tratamiento.dto.ts
- apps/api/src/modules/presupuestos/presupuestos.module.ts
- apps/api/src/modules/presupuestos/presupuestos.controller.ts
- apps/api/src/modules/presupuestos/presupuestos.service.ts
- apps/api/src/modules/presupuestos/entities/presupuesto.entity.ts
- apps/api/src/modules/presupuestos/entities/presupuesto-item.entity.ts
- apps/api/src/modules/presupuestos/entities/pago.entity.ts
- apps/api/src/modules/presupuestos/dto/create-presupuesto.dto.ts
- apps/api/src/modules/presupuestos/dto/register-pago.dto.ts

Requisitos funcionales:
- obtener odontograma completo por paciente
- actualizar estado de pieza dental
- registrar tratamiento asociado a paciente y opcionalmente a pieza dental
- crear plan de tratamiento con múltiples items
- generar presupuesto desde plan o manualmente
- registrar pagos parciales
- calcular saldo pendiente
- endpoint detalle de presupuesto con total_pagado y saldo
- estados consistentes en plan y presupuesto
- mantener trazabilidad clínica y financiera

Importante:
- no mezclar lógica de controladores con negocio
- servicios limpios
- DTOs validados
- compatibilidad con el SQL ya definido

Actualizá AppModule solo con lo necesario.
```

---

## 10) Prompt — frontend web bootstrap + auth + layout base

```md
Ahora generá la base del frontend web en apps/web con React + TypeScript.

Generá estos archivos:
- apps/web/src/main.tsx
- apps/web/src/App.tsx
- apps/web/src/router.tsx
- apps/web/src/styles.css
- apps/web/src/lib/api.ts
- apps/web/src/lib/query-client.ts
- apps/web/src/lib/auth-storage.ts
- apps/web/src/context/auth-context.tsx
- apps/web/src/components/layout/app-layout.tsx
- apps/web/src/components/layout/sidebar.tsx
- apps/web/src/components/layout/topbar.tsx
- apps/web/src/components/auth/protected-route.tsx
- apps/web/src/features/auth/pages/login-page.tsx
- apps/web/src/features/auth/hooks/use-login.ts
- apps/web/src/features/auth/types.ts
- apps/web/src/features/dashboard/pages/dashboard-page.tsx

Requisitos:
- Vite + React + TypeScript
- React Router
- TanStack Query
- login contra backend NestJS
- persistencia de JWT en storage simple
- layout con sidebar y topbar
- rutas protegidas
- dashboard inicial simple pero prolijo
- nombres consistentes con el dominio odontológico
- no usar componentes gigantes
- no generar diseño demo genérico; usar estructura de producto SaaS administrativo

Entregá contenido completo.
```

---

## 11) Prompt — frontend web pacientes + ficha clínica + adjuntos

```md
Continuando sobre el frontend web existente, generá la feature completa de pacientes y ficha clínica.

Archivos a crear:
- apps/web/src/features/pacientes/api/pacientes-api.ts
- apps/web/src/features/pacientes/hooks/use-pacientes.ts
- apps/web/src/features/pacientes/hooks/use-paciente-detalle.ts
- apps/web/src/features/pacientes/pages/pacientes-page.tsx
- apps/web/src/features/pacientes/pages/paciente-detalle-page.tsx
- apps/web/src/features/pacientes/components/pacientes-table.tsx
- apps/web/src/features/pacientes/components/paciente-form.tsx
- apps/web/src/features/pacientes/components/ficha-clinica-card.tsx
- apps/web/src/features/pacientes/components/antecedentes-list.tsx
- apps/web/src/features/pacientes/components/evolucion-clinica-list.tsx
- apps/web/src/features/pacientes/components/adjuntos-panel.tsx
- apps/web/src/features/pacientes/types.ts

Además modificá solo lo necesario en:
- apps/web/src/router.tsx
- apps/web/src/components/layout/sidebar.tsx

Requisitos:
- listado de pacientes con búsqueda
- alta y edición de paciente
- pantalla detalle con ficha clínica
- antecedentes
- evolución clínica
- panel de adjuntos/radiografías
- usar TanStack Query
- forms con React Hook Form + Zod si hace falta
- no duplicar tipos si pueden centralizarse por feature
- UX de sistema real de clínica, no landing
```

---

## 12) Prompt — frontend web agenda de turnos

```md
Generá la feature web de agenda de turnos.

Archivos a crear:
- apps/web/src/features/agenda/api/agenda-api.ts
- apps/web/src/features/agenda/hooks/use-turnos.ts
- apps/web/src/features/agenda/hooks/use-disponibilidad.ts
- apps/web/src/features/agenda/pages/agenda-page.tsx
- apps/web/src/features/agenda/components/agenda-toolbar.tsx
- apps/web/src/features/agenda/components/agenda-list.tsx
- apps/web/src/features/agenda/components/turno-form-modal.tsx
- apps/web/src/features/agenda/components/disponibilidad-badge.tsx
- apps/web/src/features/agenda/types.ts

Además modificá solo lo necesario en:
- apps/web/src/router.tsx
- apps/web/src/components/layout/sidebar.tsx

Requisitos:
- vista lista por día inicialmente
- filtros por fecha, profesional, estado
- alta/edición de turno
- chequeo de disponibilidad antes de guardar
- mensajes claros de conflicto
- usar backend existente, sin mocks
- interfaz lista para evolucionar a calendario semanal más adelante
```

---

## 13) Prompt — frontend web odontograma interactivo

```md
Generá la feature web central del sistema: odontograma interactivo.

Archivos a crear:
- apps/web/src/features/odontograma/api/odontograma-api.ts
- apps/web/src/features/odontograma/hooks/use-odontograma.ts
- apps/web/src/features/odontograma/pages/odontograma-page.tsx
- apps/web/src/features/odontograma/components/odontograma-canvas.tsx
- apps/web/src/features/odontograma/components/pieza-dental-view.tsx
- apps/web/src/features/odontograma/components/pieza-detalle-panel.tsx
- apps/web/src/features/odontograma/components/tratamiento-form.tsx
- apps/web/src/features/odontograma/types.ts

Además modificá lo necesario en:
- apps/web/src/router.tsx
- apps/web/src/features/pacientes/pages/paciente-detalle-page.tsx

Requisitos funcionales:
- renderizar grilla visual de piezas dentales
- seleccionar pieza
- visualizar estado actual
- actualizar estado de pieza
- registrar tratamiento asociado a pieza o general
- refrescar datos sin recargar pantalla
- componente central reutilizable

Requisitos técnicos:
- no usar librerías pesadas innecesarias para SVG/canvas si se puede resolver simple
- TypeScript estricto
- UI clara para uso clínico real
- mantener lógica separada entre vista y acceso a datos
```

---

## 14) Prompt — frontend web planes, presupuestos y pagos

```md
Generá la feature web para planes de tratamiento, presupuestos y pagos.

Archivos a crear:
- apps/web/src/features/presupuestos/api/presupuestos-api.ts
- apps/web/src/features/presupuestos/hooks/use-presupuesto-detalle.ts
- apps/web/src/features/presupuestos/pages/presupuestos-page.tsx
- apps/web/src/features/presupuestos/pages/presupuesto-detalle-page.tsx
- apps/web/src/features/presupuestos/components/presupuesto-form.tsx
- apps/web/src/features/presupuestos/components/presupuesto-items-table.tsx
- apps/web/src/features/presupuestos/components/pagos-table.tsx
- apps/web/src/features/presupuestos/components/registrar-pago-form.tsx
- apps/web/src/features/presupuestos/components/saldo-card.tsx
- apps/web/src/features/presupuestos/types.ts

Además modificá solo lo necesario en:
- apps/web/src/router.tsx
- apps/web/src/components/layout/sidebar.tsx

Requisitos:
- listar presupuestos
- crear presupuesto
- ver detalle con items, total, total pagado y saldo
- registrar pagos parciales
- estados visibles
- interfaz administrativa clara
- integración directa con backend real
```

---

## 15) Prompt — app móvil Expo: auth + pacientes + agenda

```md
Generá la base funcional de la app móvil en apps/mobile con Expo + React Native + TypeScript.

Archivos a crear:
- apps/mobile/App.tsx
- apps/mobile/src/navigation/index.tsx
- apps/mobile/src/lib/api.ts
- apps/mobile/src/lib/auth-storage.ts
- apps/mobile/src/context/auth-context.tsx
- apps/mobile/src/features/auth/screens/login-screen.tsx
- apps/mobile/src/features/home/screens/home-screen.tsx
- apps/mobile/src/features/pacientes/screens/pacientes-screen.tsx
- apps/mobile/src/features/pacientes/screens/paciente-detalle-screen.tsx
- apps/mobile/src/features/agenda/screens/agenda-screen.tsx
- apps/mobile/src/features/pacientes/components/paciente-card.tsx
- apps/mobile/src/features/agenda/components/turno-card.tsx
- apps/mobile/src/features/shared/components/screen-container.tsx

Requisitos:
- login con JWT
- navegación autenticada
- listado de pacientes
- detalle básico de paciente
- agenda del día o por fecha
- usar fetch o axios consistente con web
- código listo para continuar luego con odontograma móvil si se necesita
- UI simple y profesional, no demo visual innecesaria
```

---

## 16) Prompt — recordatorios mock + preparación para mensajería futura

```md
Sobre el backend NestJS existente, generá un módulo desacoplado de recordatorios preparado para futura integración con WhatsApp/email/SMS, pero inicialmente mock.

Archivos a crear:
- apps/api/src/modules/recordatorios/recordatorios.module.ts
- apps/api/src/modules/recordatorios/recordatorios.controller.ts
- apps/api/src/modules/recordatorios/recordatorios.service.ts
- apps/api/src/modules/recordatorios/providers/notifier.interface.ts
- apps/api/src/modules/recordatorios/providers/mock-notifier.service.ts
- apps/api/src/modules/recordatorios/dto/create-recordatorio.dto.ts
- apps/api/src/modules/recordatorios/dto/send-recordatorio.dto.ts

Además modificar solo lo necesario en:
- apps/api/src/app.module.ts

Requisitos:
- crear recordatorio asociado a turno y paciente si aplica
- enviar recordatorio usando provider mock
- guardar estado enviado / pendiente / fallido
- dejar interfaz lista para futuros providers reales
- endpoint manual para disparar envío
- código limpio, desacoplado y productivo
```

---

## 17) Prompt — shared types + limpieza de contratos entre apps

```md
Tomando el backend, web y mobile ya generados, creá un paquete shared-types para compartir contratos básicos entre apps sin acoplar lógica de UI.

Generá o completá:
- packages/shared-types/src/index.ts
- packages/shared-types/src/auth.types.ts
- packages/shared-types/src/pacientes.types.ts
- packages/shared-types/src/turnos.types.ts
- packages/shared-types/src/presupuestos.types.ts
- packages/shared-types/package.json
- packages/shared-types/tsconfig.json

Además modificá solo lo necesario en web y mobile para importar tipos compartidos donde tenga sentido.

Requisitos:
- no romper compilación
- mantener tipos serializables
- no mover entidades TypeORM aquí
- solo contratos de transporte y DTO-like shapes reutilizables
```

---

## 18) Prompt — refactor final, hardening y checklist productivo

```md
Hacé un refactor final del sistema generado hasta ahora, sin cambiar el comportamiento funcional.

Objetivo:
- mejorar consistencia
- reducir duplicación
- endurecer validaciones
- dejar listo para producción inicial

Tareas:
- revisar imports y naming inconsistentes
- centralizar constantes repetidas
- corregir tipos débiles o any innecesarios
- mejorar manejo de errores HTTP en backend
- asegurar DTOs y respuestas consistentes
- revisar que web y mobile consuman baseURL configurable
- revisar variables de entorno faltantes
- asegurar que auth storage sea consistente
- agregar README técnico mínimo por app

Generá o modificá solo lo necesario.

Entregá:
1. lista exacta de archivos tocados
2. contenido completo de cada archivo final
3. checklist final de qué quedó funcional
4. lista breve de próximos pasos productivos reales: tests, Docker, CI/CD, S3, mensajería real
```

---

## Prompt de corrección de rumbo

Usalo cuando el IDE empiece a inventar cosas, cambiar nombres, romper estructura o mezclar etapas.

```md
Detené la deriva y realineate con el proyecto ya generado.

Reglas obligatorias desde este punto:
- no renombres entidades, módulos, DTOs ni endpoints existentes salvo error real
- no rehagas archivos completos si solo hay que extenderlos
- respetá la arquitectura ya definida en monorepo con apps/api, apps/web, apps/mobile y packages/shared-types
- mantené NestJS en backend, React + TypeScript en web y Expo en mobile
- seguí naming consistente en español para dominio funcional
- no cambies el modelo de datos sin justificarlo en comentarios muy breves dentro del código
- no agregues librerías nuevas salvo que sean estrictamente necesarias
- entregá solo archivos finales exactos y código compilable
- priorizá consistencia con lo ya construido sobre creatividad

Antes de generar, inferí el estado actual del proyecto según los archivos ya creados en la sesión y continuá desde allí.
```

---

## Prompt extra — corrección puntual de compilación

```md
Quiero que actúes como fixer de compilación sobre el proyecto actual, sin rediseñar arquitectura.

Objetivo:
- resolver errores de TypeScript, imports, tipos, hooks, providers o módulos
- mantener comportamiento actual
- tocar la menor cantidad posible de archivos

Reglas:
- no refactorizar de más
- no renombrar APIs públicas existentes
- devolver solo archivos finales corregidos
- si hay un error por inconsistencia entre backend/web/mobile, corregirlo respetando el contrato más estable ya existente

Entregá:
1. lista de archivos corregidos
2. contenido final completo
3. sin teoría
```

---

## Prompt extra — generar Docker básico al final

```md
Sobre el proyecto actual ya funcional, generá una base Docker para desarrollo local.

Generá únicamente:
- Dockerfile para apps/api
- Dockerfile para apps/web
- docker-compose.yml en raíz
- .dockerignore necesarios

Requisitos:
- postgres en docker-compose
- variables de entorno básicas
- api y web levantables en desarrollo
- no romper el esquema de monorepo
- mantenerlo simple y funcional

Entregá solo archivos finales completos.
```

---

## Prompt extra — generar tests mínimos estratégicos

```md
Sobre el sistema ya generado, agregá tests mínimos estratégicos sin intentar cubrir todo.

Prioridades:
- auth service backend
- validación de conflictos de turnos
- cálculo de saldo en presupuesto
- un test de rendering del odontograma web

Generá solo los archivos necesarios y scripts faltantes.

Reglas:
- mantener tests simples pero útiles
- no mockear excesivamente si no hace falta
- no rediseñar el proyecto
- devolver solo código final
```

---

## Recomendación operativa de uso en Antigravity

```md
1. Pegá el Prompt maestro.
2. Ejecutá 1 etapa por vez.
3. Después de cada etapa, pedile al IDE:
   - “verificá imports, tipos y archivos tocados”
   - “no rehagas lo anterior”
4. Si rompe consistencia, usá el prompt de corrección de rumbo.
5. Si ya compiló una parte, seguí a la próxima; no vuelvas hacia atrás salvo error real.
6. Al final ejecutá refactor, Docker y tests mínimos.
```

---

## Resultado esperado al terminar la sesión

- Backend NestJS modular y consistente
- PostgreSQL modelado para clínica odontológica
- JWT + roles
- Pacientes + ficha clínica + evolución
- Radiografías y adjuntos
- Agenda con disponibilidad real
- Odontograma interactivo
- Planes, presupuestos y pagos parciales
- Recordatorios mock desacoplados
- Web administrativa funcional
- Mobile funcional para operación básica
- Base lista para evolucionar a producto SaaS real
