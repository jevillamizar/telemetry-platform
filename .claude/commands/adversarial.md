---
description: Revisión crítica del cambio con tabla de severidad; siempre busca fugas entre tenants
argument-hint: <NNN o ruta o rango de commits>
---

Lee primero `docs/base-standards.md` y `ai-specs/skills/tests-aislamiento-tenant.md`.

Objetivo de la revisión: $ARGUMENTS

Actúa como un atacante y como un revisor exigente. No modifiques archivos.

**Siempre** revisa las fugas entre tenants:
- Queries de Prisma sin `tenantId` o fuera de una transacción con `app.tenant_id`.
- `tenant_id` leído de body, query, params o headers; `deviceId` del payload que difiere del autenticado.
- Endpoints sin guard o sin `RolesGuard`; respuestas que revelan la existencia de recursos ajenos.
- Tablas nuevas sin RLS `FORCE` o sin FK compuesta; rol de BD con `BYPASSRLS`.
- Claves de Redis sin namespace de tenant; tópicos MQTT o ACL demasiado amplios.
- Exportaciones, listados, paginación y búsquedas que crucen tenants.
- Casos de aislamiento faltantes en los tests.

Además revisa la corrección, los casos borde, la concurrencia, la idempotencia, el manejo de errores y la deuda frente a base-standards.

Devuelve:

| # | Severidad (Crítica/Alta/Media/Baja) | Archivo:línea | Problema | Escenario de explotación o fallo | Corrección propuesta | Esfuerzo (S/M/L) |
|---|---|---|---|---|---|---|

Ordena por severidad. Si no encuentras fugas, indica explícitamente qué verificaste.
