---
description: Implementa UNA tarea de un spec aprobado con TDD y se detiene
argument-hint: <NNN> <Tn>
---

Lee primero `docs/base-standards.md`, el estándar que aplique (backend o frontend), el agente
correspondiente en `ai-specs/agents/` y `ai-specs/skills/ciclo-tdd.md`.

Tarea: $ARGUMENTS

1. Verifica que el spec esté en estado `Aprobado` (o `En progreso`). Si no lo está, **detente**.
2. Implementa **solo** la tarea indicada siguiendo el ciclo TDD:
   - Escribe el test y muestra la salida en **rojo**.
   - Escribe la implementación mínima y muestra la salida en **verde**.
   - Refactoriza si hace falta y vuelve a ejecutar.
3. Si la tarea requiere algo fuera del spec (otro archivo, dependencia, cambio de contrato o de modelo),
   **detente y repórtalo**: qué hace falta, por qué y la opción propuesta.
4. Muestra los archivos tocados, la salida de los tests, la cobertura del módulo y el commit propuesto
   (Conventional Commits en español). No hagas commit.

**Detente.** No empieces la siguiente tarea.
