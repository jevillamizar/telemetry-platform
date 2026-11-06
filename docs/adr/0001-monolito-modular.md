# ADR 0001 — Monolito modular en NestJS

- **Estado:** Aceptado
- **Fecha:** 2026-11-06

## Contexto
El MVP es una demo de 3 días con un solo equipo. Los microservicios suman despliegue, red y consistencia
distribuida sin aportar valor ahora.

## Decisión
Un único proceso NestJS (`apps/api`) con módulos de límites claros. Cada módulo expone servicios a los demás;
ningún módulo accede al repositorio de otro.

## Consecuencias
- Despliegue y depuración simples; transacciones locales.
- La extracción futura de un módulo (p. ej. `ingestion`) es posible si se respetan los límites.
- Riesgo: acoplamiento por atajos. Se mitiga con la revisión `/adversarial`.
