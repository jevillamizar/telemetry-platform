/** @type {import('jest').Config} */
module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  testEnvironment: "node",
  rootDir: ".",
  setupFiles: ["reflect-metadata", "<rootDir>/test/setup-env.cjs"],
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testRegex: ".*\\.(spec|e2e-spec)\\.ts$",
  collectCoverageFrom: ["src/health/**/*.ts", "src/config/**/*.ts"],
  coverageThreshold: {
    // health.controller.ts y health.module.ts quedan fuera del umbral de 90% en "branches":
    // el guard que TypeScript emite para Reflect.metadata (emitDecoratorMetadata, requerido por
    // Nest para DI) genera una rama que solo es alcanzable si reflect-metadata no está cargado,
    // lo que nunca ocurre en este proyecto. No es lógica de negocio sin probar.
    "src/health/indicators/": { branches: 90, functions: 90, lines: 90, statements: 90 },
    "src/health/with-timeout.ts": { branches: 90, functions: 90, lines: 90, statements: 90 },
    "src/health/health.controller.ts": { branches: 75, functions: 90, lines: 90, statements: 90 },
    "src/health/health.module.ts": { branches: 80, functions: 90, lines: 90, statements: 90 },
    "src/config/": { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
};
