# Estándares de backend (NestJS)

Lee primero `docs/base-standards.md`.

## Estructura
Monolito modular en `apps/api/src`:

```
auth, users, tenants, memberships, locations, devices, ingestion, readings,
rules, alerts, notifications, audit
common/ guards, decorators, interceptors, filters, tenant-context
```
`billing` y `reports` no se crean en el MVP.

## Capas por módulo
`controller` → `service` → `repository`
- **Controller:** HTTP, DTOs, Swagger y guards. Sin lógica de negocio.
- **Service:** reglas de negocio. Recibe un `TenantContext` explícito y no lee `request`.
- **Repository:** único punto que toca Prisma. Toda función operativa recibe `tenantId` como primer argumento.

## Contexto de tenant
- `AuthGuard` → `TenantContextGuard` (resuelve la membresía activa) → `RolesGuard`.
- Decorador `@CurrentTenant()` para inyectar el contexto en el controlador.
- El contexto del dispositivo (`DeviceContext`) se resuelve desde la credencial y nunca desde el payload.

## Prisma y RLS
- Cada operación operativa corre en una transacción que ejecuta `SELECT set_config('app.tenant_id', $1, true)`
  (equivale a `SET LOCAL`) antes de cualquier query.
- La migración crea las políticas RLS y un rol de app sin `BYPASSRLS`. Las migraciones usan un rol distinto.
- Relaciones con FKs compuestas: `@@unique([tenantId, id])` en el padre y `@relation(fields: [tenantId, xId], references: [tenantId, id])` en el hijo.

## DTOs y validación
- `class-validator` y `class-transformer` con `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })`.
  `tenantId` nunca forma parte de un DTO de entrada.
- Respuestas con DTOs explícitos; no se serializan entidades de Prisma directamente.

## Errores
- Filtro global con formato `{ statusCode, error, message, requestId }`.
- Un recurso de otro tenant responde 404.

## API
- Prefijo `/api/v1`. Swagger en `/api/docs`. Cada endpoint queda en `docs/api-spec.yml` al cerrar el spec.

## Ingesta
- HTTP batch: `POST /api/v1/ingestion/readings`, autenticado con la credencial del dispositivo. Idempotente por `(deviceId, ts)`.
- MQTT: tópico `devices/{deviceId}/telemetry`. La API se suscribe como cliente de servicio y deduce el dispositivo del tópico, que la ACL de Dynamic Security restringe al dueño.
- Último valor por dispositivo en Redis, con clave namespaced por tenant: `t:{tenantId}:device:{deviceId}:last`.

## Testing
- **Jest** para unitarios de servicios y reglas (≥ 90%).
- **Supertest** contra la app Nest con Postgres y Redis reales (Docker) para integración.
- Cada spec incluye la suite de aislamiento (`ai-specs/skills/tests-aislamiento-tenant.md`).
- Nombres de tests en español: `it('rechaza lectura de un dispositivo de otro tenant')`.
