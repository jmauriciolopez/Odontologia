# Dead Code Report

Proyecto: `D:\Code\odontologia`

Este reporte identifica símbolos que están definidos pero NUNCA se usan (referenciados 0 veces en el resto del proyecto).

## Dead Code de Alta Confianza (Pendiente de Revisión)

| Símbolo | Archivo | Confianza | Notas |
| :--- | :--- | :--- | :--- |
| `listenTo` | `apps/api/src/common/subscribers/tenant.subscriber.ts` | 1.0 | **Falso Positivo**: Hook de TypeORM. |
| `beforeInsert` | `apps/api/src/common/subscribers/tenant.subscriber.ts` | 1.0 | **Falso Positivo**: Hook de TypeORM. |
| `handleConnection` | `apps/api/src/modules/notifications/notifications.gateway.ts` | 1.0 | **Falso Positivo**: Lifecycle de NestJS WebSockets. |
| `handleDisconnect` | `apps/api/src/modules/notifications/notifications.gateway.ts` | 1.0 | **Falso Positivo**: Lifecycle de NestJS WebSockets. |
| `handlePing` | `apps/api/src/modules/notifications/notifications.gateway.ts` | 1.0 | **Falso Positivo**: Decorador @SubscribeMessage. |


## Falsos Positivos Identificados (Infraestructura)

Los siguientes símbolos son detectados como "Dead Code" porque son invocados por el framework (NestJS / TypeORM) y no explícitamente en el código fuente:

1.  **Decoradores**: `@Roles`, `@Public`, `@CurrentUser`. El analizador estático a veces no detecta su uso en los controladores.
2.  **Guards & Interceptors**: `canActivate`, `intercept`, `catch`. Son métodos de interfaz obligatorios llamados por NestJS.
3.  **Subscribers**: `listenTo`, `beforeInsert`. Invocados por TypeORM durante el ciclo de vida de las entidades.
4.  **WebSockets**: `handleConnection`, `handleDisconnect`. Invocados por Socket.io / NestJS.

**Conclusión**: No se debe eliminar ningún código de la lista anterior sin una validación manual exhaustiva, ya que la mayoría son componentes críticos de la arquitectura.
