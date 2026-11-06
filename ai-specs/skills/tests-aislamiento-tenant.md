# Skill: tests de aislamiento entre tenants (IDOR/BOLA)

Obligatorio en todo spec que toque datos operativos. Son tests de integración (Supertest) contra Postgres real con RLS.

## Fixture
- Tenant **A** y tenant **B**, cada uno con un usuario por rol relevante, una Location y un Device con credencial.
- Helper `asUser(tenant, role)` y `asDevice(device)` que devuelven el agente autenticado.

## Casos mínimos por recurso
| # | Caso | Esperado |
|---|---|---|
| 1 | Usuario de A hace `GET /recurso/{idDeB}` | 404 |
| 2 | Usuario de A hace `PATCH` o `PUT` sobre un id de B | 404 y B sin cambios en la BD |
| 3 | Usuario de A hace `DELETE` sobre un id de B | 404 y el registro de B sigue existiendo |
| 4 | Usuario de A lista o exporta | Solo datos de A |
| 5 | Usuario de A envía `tenantId` de B en body, query o header | Se ignora o devuelve 400; nunca opera sobre B |
| 6 | Usuario de A crea un hijo apuntando a un padre de B (p. ej. Device en Location de B) | 404 o 400; la FK compuesta también lo rechaza |
| 7 | Dispositivo de A envía lecturas con `deviceId` de B (HTTP o tópico MQTT de B) | Rechazado; B sin lecturas nuevas |
| 8 | Query directa sin `app.tenant_id` con el rol de la app | 0 filas (RLS) |
| 9 | Rol sin permiso dentro del mismo tenant | 403 |

## Regla
Un caso que falte debe justificarse por escrito en el spec. `/adversarial` lo verifica.
