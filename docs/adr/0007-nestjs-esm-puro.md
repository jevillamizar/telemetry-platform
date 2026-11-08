# ADR 0007 — NestJS 12 es ESM puro; apps/api usa NodeNext

- **Estado:** Aceptado
- **Fecha:** 2026-11-08
- **Spec relacionado:** 000 (T8)

## Contexto

Durante la implementación de T8 (HealthModule + e2e) se descubrió que NestJS 12.4.0
(la versión fijada en T1) distribuye todos sus paquetes núcleo
(`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`, `@nestjs/testing`,
`@nestjs/config`) como módulos ES puro (`"type": "module"` en cada `package.json`).
No es compatible con un consumidor CommonJS sin un wrapper de interoperabilidad.

La configuración inicial de `apps/api` usaba CommonJS (sobrescribía el `module` de
`tsconfig.base.json`). Esto funciona para compilar, pero Jest falla en tiempo de ejecución
al cargar `@nestjs/testing`:

```
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module:
  node_modules/@nestjs/testing/testing-module.builder.js
```

## Decisión

`apps/api` usa **NodeNext/NodeNext** (módulo + resolución), que ya exigía `tsconfig.base.json`.
No se sobreescriben `module` ni `moduleResolution` en el `tsconfig.json` de la app.

Consecuencias concretas:

| Área | Cambio requerido |
|---|---|
| `package.json` de la app | `"type": "module"` |
| Imports relativos en TS | Extensión `.js` explícita (p. ej. `"./health.module.js"`) |
| Jest runner | `node --experimental-vm-modules node_modules/jest/bin/jest.js` |
| ts-jest | `useESM: true` en la configuración de transform |
| Globals de Jest | Importar explícitamente desde `@jest/globals` (no hay auto-inject en ESM) |
| Mocks de módulos CJS desde ESM | `jest.unstable_mockModule` + `await import()` dinámico (en lugar de `jest.mock`) |
| `tsconfig.json` | `"isolatedModules": true` (NodeNext lo requiere; depreca la opción homónima de ts-jest) |
| `jest.config.cjs` | Debe ser `.cjs` (no `.mjs` ni `.js`) para que Jest lo cargue como CommonJS |

## Alternativas descartadas

- **CommonJS con `createRequire`:** añade complejidad en cada archivo que importa paquetes ESM.
  No escala.
- **`"module": "CommonJS"` y `esModuleInterop`:** funciona para el build de producción pero
  Jest sigue fallando al cargar los paquetes ESM de NestJS.
- **Downgrade a NestJS 10 (CJS):** rompe el lock de versiones fijadas en T1 y abre
  vulnerabilidades ya cerradas en NestJS 11-12.

## Consecuencias para specs futuros

- Todo nuevo módulo en `apps/api` debe seguir las convenciones ESM: extensión `.js` en
  imports relativos, `@jest/globals` explícito, `jest.unstable_mockModule` si se mockea un
  paquete CJS desde un spec ESM.
- T14 (CI) debe invocar Jest con `--experimental-vm-modules` tanto en el job de unit
  como en el de e2e (`node --experimental-vm-modules ...`).
- El flag `--experimental-vm-modules` es estable en Node 22; no genera warnings de producción,
  pero debe documentarse en `CLAUDE.md` una vez que T15 actualice la tabla de comandos.

## Artefacto técnico de cobertura (documentado aquí para no perderse)

`emitDecoratorMetadata` hace que TypeScript emita un guard `Reflect.metadata` en cada clase
decorada. Istanbul lo registra como rama no cubierta porque su rama-falsa (cuando
`reflect-metadata` no está cargado) nunca se ejecuta en este proyecto. No es lógica de negocio.

Solución adoptada: umbrales de `branches` reducidos a 75-80% exclusivamente para
`health.controller.ts` y `health.module.ts`, con comentario explicativo en `jest.config.cjs`.
Los archivos de lógica pura (`indicators/`, `with-timeout.ts`, `config/`) mantienen 90%.
