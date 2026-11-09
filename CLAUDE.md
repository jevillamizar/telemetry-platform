# CLAUDE.md

## Rol
Eres el desarrollador de **TEIOT**, un SaaS B2B multi-tenant de telemetría para sistemas IoT en general.
El monitoreo de cadena de frío (temperatura de equipos de refrigeración) es la vertical insignia y la
primera implementada, pero el modelo de dispositivo/lectura/alerta es genérico. Trabajas con Desarrollo
Guiado por Especificaciones (SDD, enfoque Specboot).

## Regla de oro
- **No escribas código de aplicación sin un spec aprobado** en `docs/specs/`.
- **Una tarea a la vez.** No avances a la siguiente sin confirmación del usuario.
- Si una tarea exige salirse del spec, detente y repórtalo.
- Ante ambigüedad, pregunta; no asumas.

## Idioma
Docs, specs, comentarios y commits en español. Identificadores, módulos y rutas de API en inglés.

## Orden de lectura
1. `docs/base-standards.md` (fuente única de verdad, incluye seguridad multi-tenant)
2. `docs/backend-standards.md` o `docs/frontend-standards.md` según la tarea
3. `docs/data-model.md` y `docs/api-spec.yml`
4. El spec activo en `docs/specs/` y los ADR relacionados en `docs/adr/`
5. El agente en `ai-specs/agents/` y las skills en `ai-specs/skills/`

## Comandos SDD
`/enriquecer` → `/spec` → `/implementar` (una tarea a la vez) → `/verificar` → `/adversarial` → `/cerrar`

## Comandos del proyecto
> Validados en spec 000 (T1-T14). Requisitos: Node 22.22.3, pnpm 10.20.0 (vía corepack), Docker Compose.

| Acción | Comando |
|---|---|
| Instalar | `pnpm install` |
| Infra local (Postgres, Redis, Mosquitto, API) | `docker compose up -d --wait` (copiar `.env.example` → `.env` antes) |
| Lint (monorepo) | `pnpm -r lint` |
| Typecheck (monorepo) | `pnpm -r typecheck` |
| Tests (monorepo) | `pnpm -r test` |
| Build (monorepo) | `pnpm -r build` |
| Tests API (unit + e2e, requiere infra local arriba) | `pnpm --filter api test` |
| E2E web (Playwright) | `pnpm --filter web test:e2e` |
| Validar config de mobile | `pnpm --filter mobile exec expo config --type public`<br>`pnpm --filter mobile exec expo-doctor` |

Los e2e de `apps/api` necesitan `DATABASE_URL`, `REDIS_URL`, `MQTT_URL`, `MQTT_SERVICE_USERNAME` y
`MQTT_SERVICE_PASSWORD` apuntando a la infra real (`apps/api/test/setup-env.cjs` trae valores por
defecto para los puertos estándar; si tu `.env` local los cambia —p. ej. por un conflicto de puerto—
exporta las variables correspondientes antes de correr los tests).
