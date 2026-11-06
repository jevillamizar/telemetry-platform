# Modelo de datos

> **Estado: propuesto.** Cada entidad se confirma, y este archivo se actualiza, al cerrar el spec que la implementa (`/cerrar`).

## Entidades

| Entidad | Tenant-scoped | Descripción | Spec |
|---|---|---|---|
| Tenant | — (raíz) | Empresa cliente | 001 |
| User | No (global) | Persona; puede pertenecer a varios tenants | 001 |
| Membership | Sí | User ↔ Tenant con rol | 001 |
| Location | Sí | Sede (bodega, tienda, restaurante) | 002 |
| Device | Sí | Equipo monitoreado con su sensor (ADR 0005) | 002 |
| DeviceCredential | Sí | Secreto del dispositivo (hash) para HTTP y MQTT | 002 |
| Reading | Sí | Lectura de temperatura | 003 |
| AlertRule | Sí | Umbral, duración e histéresis | 004 |
| Alert | Sí | Incidencia (excursión) | 004 |
| AlertEvent | Sí | Historial: apertura, reconocimiento, resolución, nota | 004 |

## Relaciones

```
Tenant 1─* Membership *─1 User
Tenant 1─* Location 1─* Device 1─* DeviceCredential
Device 1─* Reading
Device 1─* AlertRule        (o regla por Location; se decide en el spec 004)
AlertRule 1─* Alert 1─* AlertEvent
Membership (actor) ─* AlertEvent
```

## Campos clave (borrador)
- **Membership:** `tenant_id`, `user_id`, `role` (`OWNER|ADMIN|OPERATOR|TECHNICIAN|VIEWER`), `@@unique([tenant_id, user_id])`.
- **Device:** `tenant_id`, `location_id`, `name`, `equipment_type` (nevera, congelador, cuarto frío…),
  `target_min_c`, `target_max_c`, `status`.
- **DeviceCredential:** `tenant_id`, `device_id`, `secret_hash`, `created_at`, `revoked_at`. El secreto se muestra solo una vez.
- **Reading:** `tenant_id`, `device_id`, `ts` (hora del dispositivo), `received_at`, `temperature_c`.
  Única por `(tenant_id, device_id, ts)` para idempotencia. Índice `(tenant_id, device_id, ts DESC)`.
- **Alert:** `tenant_id`, `device_id`, `rule_id`, `status` (`OPEN|ACKNOWLEDGED|RESOLVED`), `opened_at`,
  `acknowledged_at`, `resolved_at`, `peak_temperature_c`.

## Foreign keys compuestas
Cada tabla padre declara `UNIQUE (tenant_id, id)`. Cada hijo referencia `(tenant_id, parent_id)`:

```sql
ALTER TABLE device
  ADD CONSTRAINT device_location_fk
  FOREIGN KEY (tenant_id, location_id) REFERENCES location (tenant_id, id);
```
Así la base de datos rechaza, por ejemplo, un Device del tenant A en una Location del tenant B.

## RLS
En todas las tablas tenant-scoped:

```sql
ALTER TABLE <tabla> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <tabla> FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON <tabla>
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
```
- La app usa un rol sin `BYPASSRLS`. Sin `app.tenant_id` definido, la política no devuelve filas.
- Excepciones a resolver en los specs 001 y 002: login (buscar membresías del usuario) y autenticación del
  dispositivo (buscar credencial antes de conocer el tenant). Se resuelven con funciones `SECURITY DEFINER`
  acotadas o con un rol de servicio específico, documentados en un ADR.

## Redis
- `t:{tenantId}:device:{deviceId}:last` → último valor (JSON con `ts` y `temperature_c`).
- Estado del evaluador de reglas: se define en el spec 004.

## Pendiente
- Volumen y retención de `Reading` (particionado o TimescaleDB): fuera del MVP; tabla simple con índice.
