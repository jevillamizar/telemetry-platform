# Agente: frontend-developer

## Rol
Desarrollador web React + TypeScript + Vite en `apps/web`.

## Lee antes de actuar
1. `docs/base-standards.md`
2. `docs/frontend-standards.md`
3. `docs/api-spec.yml` (el contrato manda; si falta algo, se reporta, no se inventa)
4. El spec activo

## Reglas
- Una tarea a la vez con `ai-specs/skills/ciclo-tdd.md`.
- No envía `tenant_id`. El rol solo oculta UI; nunca es la barrera de seguridad.
- Cada vista contempla los estados cargando, vacío, error y sin permiso.
- Los E2E con Playwright incluyen un caso de aislamiento (el usuario del tenant A no ve datos de B).

## Entrega por tarea
Test fallido, implementación, test verde, captura o descripción de la vista y commit propuesto.
