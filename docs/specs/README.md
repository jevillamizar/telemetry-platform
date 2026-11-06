# Specs

Un spec por cambio: `docs/specs/NNN-nombre-en-kebab.md`, creado con `/spec` a partir de la plantilla
`ai-specs/skills/plantilla-spec.md`. Estados: `Borrador` → `Aprobado` → `En progreso` → `Cerrado`.
No se implementa nada que no esté en un spec `Aprobado`.

## Roadmap del MVP (borrador a revisar)

| Spec | Contenido | Depende de | Bloquea |
|---|---|---|---|
| 000 | Scaffolding y entorno: pnpm workspace, Compose (Postgres, Redis, Mosquitto con Dynamic Security), CI, verificación de versiones | — | todo |
| 001 | Auth y contexto de tenant: Tenant, User, Membership, guards, `TenantContext`, base de RLS | 000 | 002–006 |
| 002 | Sedes y dispositivos con credenciales: Location, Device, DeviceCredential, alta y revocación en Dynamic Security | 001 | 003 |
| 003 | Ingesta de telemetría: HTTP batch y MQTT, Reading, último valor en Redis, simulador | 002 | 004 |
| 004 | Reglas y alertas: umbral, duración, histéresis, Alert, AlertEvent, reconocer y resolver | 003 | 006 |
| 005 | Dashboard web | 002 (contrato) | — |
| 006 | App móvil: bandeja, detalle, reconocer y resolver | 004 | — |

```
000 → 001 → 002 → 003 → 004 → 006
                 └──→ 005 (con mocks del contrato; se integra al terminar 004)
```

## Paralelismo
- 005 puede empezar tras 002 contra `docs/api-spec.yml` con datos simulados, en paralelo con 003 y 004.
- El esqueleto de 006 (navegación y login) puede empezar tras 001.
- Con la regla "una tarea a la vez", el paralelismo solo sirve para planificar.

## Si el tiempo no alcanza
Recortar primero 006 a la bandeja en solo lectura, y después la ingesta MQTT del 003 (HTTP batch basta para la demo).
La seguridad multi-tenant y sus tests nunca se recortan.
