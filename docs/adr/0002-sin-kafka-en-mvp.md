# ADR 0002 — Sin Kafka en el MVP

- **Estado:** Aceptado
- **Fecha:** 2026-11-06

## Contexto
El volumen de la demo (decenas de sensores simulados) no justifica un bus de eventos distribuido.

## Decisión
La ingesta llega por MQTT (Mosquitto) y HTTP batch directo a la API. La evaluación de reglas ocurre
en proceso tras persistir la lectura. Redis guarda el último valor.

## Consecuencias
- Menos infraestructura y menos puntos de fallo en la demo.
- Sin replay de eventos ni desacople fuerte entre ingesta y reglas. Si el volumen crece, se revisa
  (Redis Streams o Kafka) con un ADR nuevo.
