---
description: Crea docs/specs/NNN-nombre.md con historia, criterios, tareas, casos borde, tests y definición de terminado
argument-hint: <NNN-nombre> [resumen o referencia al /enriquecer previo]
---

Lee primero `docs/base-standards.md`, la plantilla `ai-specs/skills/plantilla-spec.md`,
`ai-specs/skills/tests-aislamiento-tenant.md` y el resultado de `/enriquecer` de esta conversación, si existe.

Spec a crear: $ARGUMENTS

Crea **solo** el archivo `docs/specs/NNN-nombre.md` con estado `Borrador`, que contenga:
- Historia de usuario.
- Criterios de aceptación numerados (CA1…).
- **Tareas ordenadas por dependencia**, cada una con archivo y función concretos y el CA que cubre.
  Cada tarea debe caber en un ciclo TDD.
- Casos borde.
- Tests requeridos, incluidos explícitamente los casos de aislamiento entre tenants aplicables.
- Riesgos y definición de terminado.

No escribas código. Muestra un resumen y pide la aprobación. Solo el usuario cambia el estado a `Aprobado`.
