# SaaS Gestión Clínica Odontológica

Monorepo para el sistema de gestión odontológica.

## Estructura
- `apps/api`: NestJS Backend.
- `apps/web`: React (Vite) Frontend.
- `apps/mobile`: Expo (React Native) App.
- `packages/shared-types`: Types & DTOs compartidos.

## Comandos Rápidos

### Instalación
```bash
npm install
```

### Desarrollo
```bash
# Correr todo en paralelo (si tienes un runner)
# O uno por uno:
npm run dev:api
npm run dev:web
npm run dev:mobile
```

### Build para Producción
```bash
npm run build
```

---
Propulsado por Antigravity (Senior Software Architect).
