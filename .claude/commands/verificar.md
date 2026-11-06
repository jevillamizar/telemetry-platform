---
description: Contrasta los criterios de aceptación del spec con el código (✅ / ⚠️ / ❌)
argument-hint: <NNN>
---

Lee primero `docs/base-standards.md` y luego el spec `docs/specs/$ARGUMENTS-*.md`.

No modifiques archivos. Para cada criterio de aceptación y cada tarea, busca la evidencia en el código y en los tests
y devuelve una tabla:

| CA / Tarea | Estado | Evidencia (archivo:línea o test) | Nota |
|---|---|---|---|

- ✅ implementado y cubierto por un test que pasa
- ⚠️ implementado parcialmente o sin test
- ❌ no implementado

Ejecuta las suites de test relevantes y adjunta el resumen. Incluye una fila por cada caso de aislamiento entre tenants
exigido. Termina con la lista de pendientes para llegar a la definición de terminado.
