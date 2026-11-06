# ADR 0006 — Notificaciones solo in-app en el MVP

- **Estado:** Aceptado
- **Fecha:** 2026-11-06

## Contexto
La app móvil tiene una bandeja de alertas. El push en Android requiere un proyecto FCM y un build de desarrollo.

## Decisión
Bandeja in-app en web y móvil, con refresco por polling o SSE (se decide en el spec 004 o 005).
Push (Expo) y email quedan como extras fuera del MVP.

## Consecuencias
- El operador solo se entera si tiene la app o la web abierta: es aceptable para la demo, no para producción.
- El módulo `notifications` se limita a la bandeja; el diseño debe permitir agregar canales después.
