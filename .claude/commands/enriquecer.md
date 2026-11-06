---
description: Analiza el código y una idea; devuelve contexto, alcance, criterios, casos borde y riesgos sin tocar código
argument-hint: <idea o número de spec del roadmap>
---

Lee primero `docs/base-standards.md`, después `docs/specs/README.md`, `docs/data-model.md`,
`docs/api-spec.yml` y los ADR relevantes.

Idea a enriquecer: $ARGUMENTS

**No modifiques ningún archivo.** Analiza el código existente y devuelve, en español:

1. **Contexto actual:** qué existe hoy (archivos y funciones concretos) y qué falta.
2. **Alcance propuesto.**
3. **Qué NO entra** (respetando el alcance del MVP de base-standards).
4. **Criterios de aceptación** en formato Dado/Cuando/Entonces, incluidos los de aislamiento entre tenants.
5. **Casos borde.**
6. **Riesgos**, con foco en seguridad multi-tenant.
7. **Preguntas abiertas** (máximo 5) que bloqueen la escritura del spec.

Termina indicando que el siguiente paso es `/spec`, y espera.
