---
description: Cierra un spec; marca tareas, actualiza data-model y api-spec, crea ADR y propone el commit
argument-hint: <NNN>
---

Lee primero `docs/base-standards.md` y el spec `docs/specs/$ARGUMENTS-*.md`.

1. Comprueba que `/verificar` no deje ❌ y que `/adversarial` no tenga hallazgos críticos ni altos abiertos.
   Si los hay, **detente** y lístalos.
2. Marca como `[x]` las tareas y criterios completados, y cambia el estado del spec a `Cerrado`.
3. Actualiza `docs/data-model.md` con las entidades, campos, FKs, RLS y claves de Redis tal como quedaron en el código.
4. Actualiza `docs/api-spec.yml` con los endpoints nuevos o modificados (paths, schemas, seguridad y errores).
5. Si hubo decisiones durante el spec, crea `docs/adr/NNNN-titulo.md` (Contexto, Decisión, Alternativas, Consecuencias).
6. Muestra el diff de la documentación y **propón** el mensaje de commit (Conventional Commits en español).
   No hagas commit sin confirmación.
