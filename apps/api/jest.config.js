/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  setupFiles: ["reflect-metadata"],
  roots: ["<rootDir>/src", "<rootDir>/test"],
  testRegex: ".*\\.spec\\.ts$",
  collectCoverageFrom: ["src/health/**/*.ts", "src/config/**/*.ts"],
  coverageThreshold: {
    "src/health/": { branches: 90, functions: 90, lines: 90, statements: 90 },
    "src/config/": { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
};
