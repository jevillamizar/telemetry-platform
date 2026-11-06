# Plantilla de spec

```markdown
# Spec NNN — <nombre>

- **Estado:** Borrador
- **Depende de:** <specs>
- **ADR relacionados:** <adr>

## Historia de usuario
Como <rol>, quiero <capacidad>, para <beneficio>.

## Contexto actual
<qué existe hoy en el código y los docs>

## Alcance
- ...

## Fuera de alcance
- ...

## Criterios de aceptación
- [ ] CA1 — Dado ..., cuando ..., entonces ...

## Tareas (ordenadas por dependencia)
- [ ] T1 — `apps/api/src/<modulo>/<archivo>.ts` → `<función>`: <qué hace>. Cubre CA1.

## Casos borde
- ...

## Tests requeridos
- Unitarios: ...
- Integración: ...
- Aislamiento entre tenants (ver `ai-specs/skills/tests-aislamiento-tenant.md`): casos 1–9 aplicables.

## Riesgos
- ...

## Definición de terminado
- [ ] Todos los CA en ✅ según `/verificar`
- [ ] Sin hallazgos críticos ni altos abiertos en `/adversarial`
- [ ] Cobertura ≥ 90% en servicios y reglas
- [ ] `docs/data-model.md` y `docs/api-spec.yml` actualizados
- [ ] ADR creado si hubo decisiones
```
