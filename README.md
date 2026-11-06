# ColdChain Telemetry Platform

SaaS B2B multi-tenant para monitoreo de cadena de frío (temperatura de equipos de refrigeración),
con ingesta de telemetría por HTTP batch y MQTT, alertas por umbral y dashboards web/móvil.

## Estado del proyecto

Este repositorio se desarrolla con **SDD (Desarrollo Guiado por Especificaciones)**, enfoque Specboot.
Actualmente solo existe documentación y especificaciones; el scaffolding del monorepo (spec 000) está
en progreso y **no hay código de aplicación validado todavía**.

## Cómo se trabaja aquí

1. Lee primero [`docs/base-standards.md`](docs/base-standards.md) — es la fuente única de verdad,
   incluye las reglas de seguridad multi-tenant.
2. Cada funcionalidad nace de un spec en [`docs/specs/`](docs/specs/) (ver
   [`docs/specs/README.md`](docs/specs/README.md) para el roadmap).
3. Flujo: `/enriquecer` → `/spec` → `/implementar` (una tarea a la vez) → `/verificar` → `/adversarial` → `/cerrar`.
4. Regla de oro: no se escribe código de aplicación sin un spec aprobado, y no se avanza a la siguiente
   tarea sin confirmación.

Más detalle del rol y las reglas en [`CLAUDE.md`](CLAUDE.md).

## Documentación

| Carpeta/archivo | Contenido |
|---|---|
| `docs/base-standards.md` | Reglas base y de seguridad multi-tenant |
| `docs/backend-standards.md` | Estándares de backend (NestJS, Prisma) |
| `docs/frontend-standards.md` | Estándares de frontend (web y móvil) |
| `docs/data-model.md` | Modelo de datos propuesto |
| `docs/api-spec.yml` | Contrato de API (OpenAPI) |
| `docs/product/prd.md` | Visión y alcance de producto |
| `docs/specs/` | Especificaciones por número (`NNN-nombre.md`) |
| `docs/adr/` | Decisiones de arquitectura |
| `ai-specs/` | Agentes y skills usados durante la implementación |

## Stack previsto

Node 22.22.3 · pnpm 10.20.0 · NestJS + Prisma + PostgreSQL + Redis · MQTT 5 (Mosquitto, Dynamic Security) ·
React + Vite (web) · React Native + Expo (móvil, Android primero) · Docker Compose · GitHub Actions.

Las versiones exactas verificadas están en [`docs/base-standards.md` §6](docs/base-standards.md#6-versiones-fijadas).

## Comandos

> ⚠️ Aún no validados: se definen durante el spec 000 (scaffolding). Ver la tabla en
> [`CLAUDE.md`](CLAUDE.md) para el estado actual.
