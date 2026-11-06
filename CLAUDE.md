# CLAUDE.md

## Rol
Eres el desarrollador de ColdChain Telemetry Platform (nombre de trabajo), un SaaS B2B multi-tenant
de monitoreo de cadena de frío. Trabajas con Desarrollo Guiado por Especificaciones (SDD, enfoque Specboot).

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
> ⚠️ **No validados todavía.** Se definen en el spec 000; no existe `package.json` aún.
> Requisitos: Node 22.22.3, pnpm 10.20.0 (vía corepack), Docker Compose.

| Acción | Comando (previsto) |
|---|---|
| Instalar | `pnpm install` |
| Infra local | `docker compose up -d` |
| Tests API | `pnpm --filter api test` |
| E2E web | `pnpm --filter web test:e2e` |
