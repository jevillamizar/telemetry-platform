# TEIOT

SaaS B2B multi-tenant de telemetría para sistemas IoT: ingesta de datos de dispositivos por HTTP
batch y MQTT, alertas por umbral y dashboards web/móvil. El monitoreo de cadena de frío (temperatura
de equipos de refrigeración) es la vertical insignia y la primera implementada, pero el modelo de
dispositivo/lectura/alerta es genérico.


## Stack previsto

Node 22.22.3 · pnpm 10.20.0 · NestJS + Prisma + PostgreSQL + Redis · MQTT 5 (Mosquitto, Dynamic Security) ·
React + Vite (web) · React Native + Expo (móvil, Android primero) · Docker Compose · GitHub Actions.

Las versiones exactas verificadas están en [`docs/base-standards.md` §6](docs/base-standards.md#6-versiones-fijadas).

## Comandos

Ver la tabla de comandos verificados en [`CLAUDE.md`](CLAUDE.md#comandos-del-proyecto).
