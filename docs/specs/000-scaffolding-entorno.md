# Spec 000 — Scaffolding y entorno

- **Estado:** Aprobado
- **Depende de:** —
- **ADR relacionados:** 0001 (monolito modular), 0002 (sin Kafka), 0004 (Mosquitto Dynamic Security), 0007 (NestJS 12 ESM puro)

## Historia de usuario
Como desarrollador del equipo, quiero un monorepo reproducible con la infraestructura local y el CI listos,
para implementar los specs 001–006 sobre una base verificada y no sobre supuestos.

## Contexto actual
- Solo existe documentación (`CLAUDE.md`, `docs/`, `ai-specs/`, `.claude/commands/`). No hay `package.json`,
  apps, Docker Compose ni CI.
- Entorno local: Node v22.14.0 (se debe actualizar a 22.22.3 con fnm), corepack 0.31.0, Docker 29.2.0,
  Compose v5.0.2. pnpm sin activar. Nada de esto se ha probado con el proyecto.
- Remoto `origin` vacío; rama local `master`.

## Decisiones de este spec (respuestas a `/enriquecer`)
| Tema | Decisión |
|---|---|
| PostgreSQL | Imagen `postgres:16` (tag menor exacto fijado en T2) |
| Móvil | Development Build desde el inicio: `expo-dev-client` y `eas.json` incluidos en este spec |
| Health | `GET /api/health` compuesto: Postgres, Redis y MQTT |
| Red Docker | Red privada `coldchain` por nombre de servicio; solo se publican al host los puertos necesarios |
| CI | Runners públicos de GitHub (`ubuntu-latest`) con `services:` para Postgres y Redis |

## Alcance
- Raíz del monorepo: `.nvmrc`, `.npmrc` (`engine-strict=true`), `package.json` (`packageManager`, `engines`,
  scripts), `pnpm-workspace.yaml`, `tsconfig.base.json`, ESLint, Prettier, `.gitignore`, `.editorconfig`, `.env.example`.
- `apps/api`: NestJS mínimo con `HealthModule` (Postgres, Redis, MQTT) y Jest + Supertest.
- `apps/web`: Vite + React + TS mínimo con Vitest y Playwright (un test de humo).
- `apps/mobile`: Expo + Expo Router mínimo con `expo-dev-client`, `eas.json` y un test de humo.
- `apps/simulator`: paquete TS vacío con un script de humo (la lógica llega en el spec 003).
- `docker-compose.yml`: `postgres`, `redis`, `mosquitto` (Dynamic Security, sin anónimos) y `api`, con healthchecks y red privada.
- Configuración de Mosquitto en `infra/mosquitto/`.
- CI en `.github/workflows/ci.yml`: lint, typecheck, test y build.
- Tabla de versiones verificadas en `docs/base-standards.md` §6.

## Fuera de alcance
- Prisma (schema, cliente y migraciones), entidades, auth y RLS → spec 001.
- Endpoints de dominio, UI de producto y pantallas → specs 001–006.
- Lógica del simulador → spec 003. Alta de clientes MQTT por dispositivo → spec 002.
- Builds de EAS en la nube, cuenta Expo, FCM y push.
- Despliegue a cualquier ambiente que no sea local.

## Criterios de aceptación
- [x] **CA1** — Dado el repo clonado con Node 22.22.3, cuando ejecuto `corepack enable` y `pnpm install`, entonces
  instala sin errores, `pnpm --version` es `10.20.0` y se genera `pnpm-lock.yaml`.
- [x] **CA2** — Dado Node distinto de 22.22.3, cuando ejecuto `pnpm install`, entonces falla con un mensaje de `engines`.
- [x] **CA3** — Dado `.env` copiado de `.env.example`, cuando ejecuto `docker compose up -d --wait`, entonces
  `postgres`, `redis`, `mosquitto` y `api` quedan `healthy`.
- [x] **CA4** — Dado el stack arriba, cuando un cliente MQTT se conecta sin credenciales o con credenciales inválidas,
  entonces el broker rechaza la conexión.
- [x] **CA5** — Dado el stack arriba, cuando la API arranca, entonces se conecta a Mosquitto con su cliente de servicio
  (credenciales desde variables de entorno) y lo registra en el log sin imprimir secretos.
- [x] **CA6** — Dado el stack arriba, cuando llamo `GET /api/health`, entonces responde `200` con
  `{ "status": "ok", "checks": { "postgres": "up", "redis": "up", "mqtt": "up" } }`.
- [x] **CA7** — Dado que una dependencia (p. ej. Redis) está caída, cuando llamo `GET /api/health`, entonces responde
  `503` con `status: "error"` y esa dependencia en `"down"`, sin filtrar mensajes internos ni credenciales.
- [ ] **CA8** — Dado el monorepo, cuando ejecuto `pnpm -r lint`, `pnpm -r typecheck`, `pnpm -r test` y `pnpm -r build`,
  entonces todos terminan en verde.
- [ ] **CA9** — Dado un push o PR a `main`, cuando corre `.github/workflows/ci.yml`, entonces todos los pasos terminan en verde.
- [ ] **CA10** — Dado `apps/mobile`, cuando ejecuto `pnpm --filter mobile exec expo config --type public` y
  `npx expo-doctor`, entonces la configuración es válida e incluye `expo-dev-client` y `expo-router`.
- [x] **CA11** — Dado el repo, cuando busco secretos, entonces ningún `.env` real está versionado y `.env.example`
  no contiene valores reales.
- [x] **CA12** — Dado `docs/base-standards.md` §6, cuando reviso las versiones, entonces todas las dependencias
  principales figuran con versión exacta verificada y coinciden con los `package.json` (sin `^` ni `~`).

> **Aislamiento entre tenants:** no aplica en este spec, porque no hay datos operativos. Se justifica según
> `ai-specs/skills/tests-aislamiento-tenant.md`. El CA4 cubre la base de la barrera MQTT del ADR 0004.

## Tareas (ordenadas por dependencia)
Cada tarea es un ciclo de `/implementar`. En las tareas solo de configuración, el "test rojo" es el comando de
verificación indicado, ejecutado antes del cambio.

- [x] **T0** — Prerrequisito manual (usuario): Node 22.22.3 con fnm y pnpm 10.20.0 con corepack. Verificación:
  `node --version` y `pnpm --version`. Opcional: renombrar `master` → `main`.
- [x] **T1** — Verificar versiones vigentes (npm registry y Docker Hub) de NestJS, @nestjs/terminus, ioredis, mqtt,
  React, Vite, Vitest, Playwright, Expo SDK (y sus RN/React compatibles), TypeScript, ESLint, Prettier, Jest, Supertest,
  y los tags de las imágenes `postgres:16.x`, `redis`, `eclipse-mosquitto:2.x`. Registrar la tabla en
  `docs/base-standards.md` §6. Cubre CA12.
- [x] **T2** — Raíz: `.nvmrc`, `.npmrc`, `package.json` (scripts `lint`, `typecheck`, `test`, `build` recursivos),
  `pnpm-workspace.yaml`, `tsconfig.base.json` (`strict`, `noUncheckedIndexedAccess`), `.editorconfig`, `.gitignore`.
  Verificación: `pnpm install` en verde y en rojo con otra versión de Node. Cubre CA1, CA2 y CA11.
- [x] **T3** — Lint y formato compartidos: `eslint.config.mjs` (flat config, typescript-eslint) y `prettier.config.mjs` en la raíz.
  Verificación: `pnpm -r lint`. Cubre CA8.
- [x] **T4** — `apps/api` mínimo: `src/main.ts` → `bootstrap()` (prefijo global `api`, puerto desde `PORT`),
  `src/app.module.ts` → `AppModule`, `src/config/env.validation.ts` → `validateEnv()` (falla rápido si faltan variables).
  Test rojo: `test/env.validation.spec.ts` (rechaza la configuración sin `DATABASE_URL`, `REDIS_URL` y `MQTT_URL`).
  Cubre CA8.
- [x] **T5** — `apps/api/src/health/indicators/postgres.health.ts` → `PostgresHealthIndicator.check()` (`SELECT 1` con
  timeout). Test unitario rojo con un cliente simulado: `up` y `down`. Cubre CA6 y CA7.
- [x] **T6** — `apps/api/src/health/indicators/redis.health.ts` → `RedisHealthIndicator.check()` (`PING` con timeout).
  Test unitario `up` y `down`. Cubre CA6 y CA7.
- [x] **T7** — `apps/api/src/mqtt/mqtt-client.provider.ts` → `createMqttServiceClient()` (MQTT 5, credenciales del cliente
  de servicio desde env, reconexión, log sin secretos) y `apps/api/src/health/indicators/mqtt.health.ts` →
  `MqttHealthIndicator.check()`. Tests unitarios. Cubre CA5, CA6 y CA7.
- [x] **T8** — `apps/api/src/health/health.controller.ts` → `HealthController.check()` en `GET /api/health`, sin guard,
  con la respuesta de CA6 y CA7. Test de integración rojo `test/health.e2e-spec.ts` con Supertest (dependencias reales
  en verde, una simulada caída da 503 y el cuerpo no expone errores internos). Cubre CA6 y CA7.
  _CA6 (200, todo up) confirmado end-to-end en T10 contra el stack completo. CA7 verificado en e2e desde esta tarea._
  _Hallazgo: NestJS 12.4.0 es ESM puro; requirió migración completa de apps/api a NodeNext. Ver ADR 0007._
- [x] **T9** — Mosquitto: `infra/mosquitto/mosquitto.conf` (listener 1883, `allow_anonymous false`, plugin Dynamic Security
  con `plugin_opt_config_file`), script `infra/mosquitto/init-dynsec.sh` → crea el admin y el cliente de servicio de la API
  con rol de suscripción a `devices/+/telemetry` desde env si el archivo no existe. Verificación: `mosquitto_pub` anónimo
  rechazado y el cliente de servicio aceptado. Cubre CA4 y CA5.
  _Verificado manualmente contra el contenedor real (sin integrar aún a docker-compose.yml, eso es T10):
  anónimo y credenciales inválidas rechazados, cliente de servicio autenticado y con SUBACK válido en
  `devices/+/telemetry`, bootstrap idempotente tras restart. Detalle de permisos documentado en ADR 0004._
- [x] **T10** — `docker-compose.yml`: red `coldchain`, volúmenes nombrados, `postgres:16.x` (healthcheck `pg_isready`),
  `redis` (healthcheck `redis-cli ping`), `mosquitto` (healthcheck con el cliente de servicio), `api` (`build` desde
  `apps/api/Dockerfile` multi-stage, `depends_on: condition: service_healthy`, healthcheck a `/api/health`).
  Puertos al host configurables por env. `.env.example` con todas las variables y sin valores reales.
  Verificación: `docker compose up -d --wait`. Cubre CA3 y CA11.
  _Confirmado contra el stack real: los 4 servicios quedan `healthy`; `GET /api/health` responde 200 con los
  tres checks en `up` (CA6, pendiente desde T8) y 503 al detener Redis (CA7). Bug encontrado y corregido:
  `tsc` compilaba a `dist/src/main.js` en vez de `dist/main.js` e incluía los `*.spec.ts`; se agregó
  `apps/api/tsconfig.build.json` (rootDir `src`, excluye specs) y se ajustó el script `build`._
- [x] **T11** — `apps/web` mínimo: Vite + React + TS, `src/App.tsx` → `App` con el título del producto, test Vitest rojo
  `src/App.test.tsx`, `playwright.config.ts` y `e2e/smoke.spec.ts` (la página carga). Cubre CA8.
  _Se usa `happy-dom` en vez de `jsdom` como entorno de Vitest: `jsdom@31` arrastra `undici@8.12.4`, cuyo
  interceptor de decompresión rompe con `TypeError: Cannot read properties of undefined (reading 'bind')`
  al cargar en el worker de Vitest (bug de esa versión de undici, no de este proyecto). `happy-dom` no
  depende de `undici` y es más liviano para un smoke test. Verificado: `pnpm -r lint/typecheck/test/build`
  en verde (apps/api + apps/web) y `pnpm test:e2e` (Playwright/Chromium) en verde._
- [ ] **T12** — `apps/mobile` mínimo: Expo SDK verificado en T1, Expo Router (`app/_layout.tsx`, `app/index.tsx`),
  `expo-dev-client`, `app.json` (Android primero, `scheme`, `android.package`), `eas.json` con perfil `development`
  (`developmentClient: true`, `distribution: internal`), test de humo con React Native Testing Library. Sin build en la nube.
  Cubre CA8 y CA10.
- [ ] **T13** — `apps/simulator` mínimo: `src/index.ts` → `main()` que valida su configuración y termina; test de humo.
  Cubre CA8.
- [ ] **T14** — `.github/workflows/ci.yml`: `ubuntu-latest`, `actions/setup-node` con `node-version-file: .nvmrc`,
  `corepack enable`, caché de pnpm, `pnpm install --frozen-lockfile`, lint, typecheck, test (con `services:` Postgres 16
  y Redis, y Mosquitto como contenedor con la config de `infra/`) y build. Playwright con navegador Chromium.
  Cubre CA9.
- [ ] **T15** — Actualizar la sección de comandos de `CLAUDE.md` con los comandos reales verificados (quitar "no validados").
  Cubre CA8.

## Casos borde
- Puertos 5432, 6379, 1883 o 3000 ocupados en el host → puertos publicados configurables por env.
- Variables obligatorias ausentes → la API no arranca y nombra la variable que falta (sin imprimir valores).
- Archivo de Dynamic Security inexistente en el primer arranque → el init lo crea; si ya existe, no lo sobrescribe (idempotente).
- Mosquitto baja privilegios al usuario `mosquitto` tras abrir el socket → el init hace `chown mosquitto:mosquitto`
  sobre `dynamic-security.json` recién creado (si no, el broker no puede releerlo). Ver ADR 0004.
- Mosquitto arranca después de la API → reconexión con backoff; el health reporta `mqtt: down` hasta conectar.
- Health check con una dependencia colgada → timeout por check (p. ej. 1 s) para que el endpoint no se bloquee.
- Lockfile generado en Windows y CI en Linux → `--frozen-lockfile` debe pasar; se verifica en T14.
- Saltos de línea CRLF en scripts `.sh` montados en contenedores Linux → `.gitattributes` con `*.sh text eol=lf`.
- Versiones de Expo, React Native y React incompatibles → se fijan las que dicta el SDK elegido en T1.

## Tests requeridos
- **Unitarios (Jest, `apps/api`):** `validateEnv`, `PostgresHealthIndicator`, `RedisHealthIndicator` y `MqttHealthIndicator`
  (`up`, `down` y timeout). Cobertura ≥ 90% en `src/health` y `src/config`.
- **Integración (Supertest):** `GET /api/health` con dependencias reales (200) y con una caída (503 sin filtrar detalles).
- **Infra:** conexión MQTT anónima rechazada y cliente de servicio aceptado (script en `infra/mosquitto/` o test de integración).
- **Web:** Vitest de `App` y Playwright de humo.
- **Móvil:** test de humo de la pantalla índice.
- **Simulador:** test de humo de `main()`.
- **Aislamiento entre tenants:** no aplica (sin datos operativos). Justificado arriba.

## Riesgos
- **R1 (alto, seguridad):** Dynamic Security mal configurado permite conexiones anónimas o con ACL amplia. Mitigación: CA4 y `allow_anonymous false` explícito.
- **R2 (alto, seguridad):** secretos commiteados. Mitigación: `.gitignore`, `.env.example` sin valores reales y CA11.
- **R3 (medio):** incompatibilidad del Expo SDK con la versión de Node o pnpm (hoisting). Mitigación: `node-linker=hoisted` solo si Expo lo exige, documentado.
- **R4 (medio):** el health expone información interna. Mitigación: cuerpo fijo `up`/`down` y CA7.
- **R5 (medio):** tiempo. Las 15 tareas son pequeñas pero muchas; si aprieta el plazo, T12 (móvil) y T13 (simulador) pueden reducirse a `package.json` y un test de humo.
- **R6 (bajo):** la imagen de Mosquitto no trae `mosquitto_ctrl` o cambia el mecanismo de inicialización de dynsec. Se verifica en T1 y T9.

## Definición de terminado
- [ ] Todos los CA en ✅ según `/verificar`
- [ ] Sin hallazgos críticos ni altos abiertos en `/adversarial`
- [ ] Cobertura ≥ 90% en `apps/api/src/health` y `apps/api/src/config`
- [ ] `docs/api-spec.yml` con `GET /api/health` documentado
- [ ] `docs/base-standards.md` §6 con la tabla de versiones verificadas
- [ ] `CLAUDE.md` con los comandos reales
- [ ] ADR si hubo decisiones nuevas (p. ej. `node-linker`, mecanismo de init de dynsec)
