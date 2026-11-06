# Estándares base (fuente única de verdad)

Este documento prevalece sobre cualquier otro. Si un spec, agente o skill lo contradice, gana este archivo
y la contradicción se reporta.

## 1. Seguridad multi-tenant (no negociable)

**Criterio crítico:** un usuario de la empresa A no puede consultar, modificar, eliminar ni exportar datos
de la empresa B, aunque manipule IDs, parámetros HTTP, headers, cuerpos o identificadores de dispositivo.

1. **Tenant desde la autenticación.** El tenant activo se resuelve a partir del usuario autenticado y su
   `Membership`. Nunca se acepta `tenant_id` enviado por el cliente (query, body, path ni header) como fuente
   de autorización.
2. **El dispositivo no envía `tenant_id`.** El servidor lo deduce de la `DeviceCredential` (HTTP) o de la
   identidad MQTT autenticada por Mosquitto Dynamic Security (usuario MQTT = `deviceId`). Si el payload trae
   `tenant_id` o un `deviceId` distinto al autenticado, se rechaza.
3. **Repositorios tenant-scoped.** Toda consulta de datos operativos recibe el `tenantId` autorizado como
   parámetro obligatorio. Prohibido `findUnique({ where: { id } })` sin filtro de tenant.
4. **RLS en PostgreSQL como segunda barrera.** Tablas operativas con `ENABLE` y `FORCE ROW LEVEL SECURITY`,
   política por `current_setting('app.tenant_id')`. La app se conecta con un rol sin `BYPASSRLS`.
5. **Foreign keys compuestas** `(tenant_id, <entidad>_id)` para impedir relaciones entre tenants distintos.
6. **Roles:** `OWNER`, `ADMIN`, `OPERATOR`, `TECHNICIAN`, `VIEWER`, aplicados con `RolesGuard`.
   La matriz de permisos se define en cada spec.
7. **Tests IDOR/BOLA obligatorios.** Cada spec incluye tests de integración con dos tenants (A y B) que
   prueban lectura, modificación, borrado, exportación y suplantación de dispositivo cruzados.
   Respuesta esperada ante recurso de otro tenant: **404** (no revelar existencia).

Todas las entidades operativas llevan `tenant_id`.

## 2. Forma de trabajo
- **Pasos pequeños y cambios incrementales.** Una tarea del spec por vez; cada tarea deja el repo en verde.
- **TDD:** test fallido primero → implementación mínima → test verde → refactor.
- **Cobertura ≥ 90%** (líneas y ramas) en servicios y en el motor de reglas. Controladores cubiertos por tests de integración.
- Nada fuera del spec. Si hace falta, se detiene y se reporta.

## 3. Código
- TypeScript en modo `strict` (incluye `noUncheckedIndexedAccess`). Sin `any` implícito ni `@ts-ignore` sin justificación.
- Nombres descriptivos en inglés; sin abreviaturas crípticas.
- Validación en el borde (DTOs); el dominio confía en datos ya validados.
- Errores con tipos explícitos; sin `catch` vacíos.
- Comentarios en español, solo para explicar el porqué.

## 4. Idioma
Docs, specs, comentarios y mensajes de commit en español. Identificadores, módulos, rutas de API, tablas y columnas en inglés.

## 5. Commits
Conventional Commits: tipo y alcance en inglés, descripción en español, imperativo.
Ejemplo: `feat(devices): agrega emisión de credenciales de dispositivo`.
Un commit por tarea completada en verde.

## 6. Versiones fijadas
Verificadas en npm registry y Docker Hub el 2026-11-06 (spec 000, tarea T1). Se fijan exactas (sin `^` ni `~`)
en los `package.json` correspondientes.

| Herramienta / paquete | Versión | Uso |
|---|---|---|
| Node | 22.22.3 | runtime (`.nvmrc`, `engines`) |
| pnpm | 10.20.0 | gestor de paquetes (`packageManager`, vía corepack) |
| TypeScript | 5.9.3 | todo el monorepo (TS 7 aún no es compatible con ts-jest/typescript-eslint) |
| ESLint | 10.14.0 | lint |
| typescript-eslint | 8.72.1 | lint TS |
| Prettier | 3.9.10 | formato |
| **apps/api** | | |
| @nestjs/core, /common, /platform-express | 12.4.0 | framework |
| @nestjs/terminus | 12.1.0 | health checks |
| @nestjs/config | 12.1.1 | configuración/env |
| @nestjs/cli | 12.0.12 | tooling Nest |
| ioredis | 6.0.0 | cliente Redis |
| mqtt | 5.16.1 | cliente MQTT 5 |
| class-validator | 0.15.1 | DTOs |
| class-transformer | 0.5.1 | DTOs |
| jest | 30.5.2 | tests |
| ts-jest | 29.4.15 | transform TS en Jest (peer: jest ^29 \|\| ^30) |
| @types/jest | 30.0.0 | tipos |
| supertest | 7.3.1 | tests de integración |
| **apps/web** | | |
| react, react-dom | 19.3.1 | UI |
| vite | 8.3.6 | build/dev server |
| @vitejs/plugin-react | 6.2.1 | plugin React para Vite |
| vitest | 5.1.0 | unit tests |
| @playwright/test | 1.65.0 | e2e |
| **apps/mobile** (Expo SDK 58) | | |
| expo | 58.0.23 | framework |
| react, react-dom | 19.3.0 | fijado por Expo SDK 58 (distinto de apps/web) |
| react-native | 0.88.1 | fijado por Expo SDK 58 |
| expo-router | 58.0.30 | navegación |
| expo-dev-client | 58.0.18 | development build |
| eas-cli | 27.5.0 | tooling EAS (solo local, sin build en la nube) |
| @testing-library/react-native | 14.1.0 | test de humo |
| **Infraestructura (Docker)** | | |
| `postgres` | `16.15` | BD |
| `redis` | `8.10.3-alpine` | caché/último valor |
| `eclipse-mosquitto` | `2.0.22` | broker MQTT, Dynamic Security |

Nota: Node mínimo exigido por Expo SDK 58 es 22.13.x, compatible con el Node 22.22.3 fijado arriba.

## 7. Alcance del MVP
Entra: tenants, sedes, dispositivos, ingesta HTTP batch y MQTT, lecturas, último valor en Redis,
alertas por umbral (duración e histéresis), dashboard web, app móvil con bandeja de alertas,
reconocimiento y resolución, simulador de sensores.

No entra: Kafka, hardware, facturación real (`billing`), reportes (`reports`), push y email,
vacunas o medicamentos, otros nichos, piloto físico.
