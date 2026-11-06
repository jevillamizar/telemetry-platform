# ADR 0005 — Device representa al equipo monitoreado

- **Estado:** Aceptado
- **Fecha:** 2026-11-06

## Contexto
El cliente piensa en "equipos" (nevera, congelador, cuarto frío). El modelo inicial va de Location a Device.

## Decisión
En el MVP, `Device` = equipo con un sensor de temperatura: `name`, `equipment_type`, `target_min_c` y `target_max_c`.
No se crea una entidad `Asset`.

## Consecuencias
- Menos entidades, endpoints y pantallas para la demo de 3 días.
- Un equipo con varios sensores, o el reemplazo de un sensor conservando el historial del equipo, requerirá
  introducir `Asset` con migración y un ADR nuevo.
