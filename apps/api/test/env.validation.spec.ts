import { validateEnv } from "../src/config/env.validation";

describe("validateEnv", () => {
  const configCompleta = {
    DATABASE_URL: "postgresql://user:pass@localhost:5432/coldchain",
    REDIS_URL: "redis://localhost:6379",
    MQTT_URL: "mqtt://localhost:1883",
  };

  it("acepta una configuración con todas las variables requeridas", () => {
    expect(() => validateEnv(configCompleta)).not.toThrow();
  });

  it("rechaza la configuración sin DATABASE_URL", () => {
    const { DATABASE_URL: _DATABASE_URL, ...resto } = configCompleta;
    expect(() => validateEnv(resto)).toThrow(/DATABASE_URL/);
  });

  it("rechaza la configuración sin REDIS_URL", () => {
    const { REDIS_URL: _REDIS_URL, ...resto } = configCompleta;
    expect(() => validateEnv(resto)).toThrow(/REDIS_URL/);
  });

  it("rechaza la configuración sin MQTT_URL", () => {
    const { MQTT_URL: _MQTT_URL, ...resto } = configCompleta;
    expect(() => validateEnv(resto)).toThrow(/MQTT_URL/);
  });

  it("rechaza la configuración vacía sin imprimir valores en el mensaje", () => {
    try {
      validateEnv({});
      fail("se esperaba que lanzara un error");
    } catch (error) {
      const mensaje = (error as Error).message;
      expect(mensaje).toMatch(/DATABASE_URL/);
      expect(mensaje).toMatch(/REDIS_URL/);
      expect(mensaje).toMatch(/MQTT_URL/);
      expect(mensaje).not.toMatch(/postgresql:\/\//);
    }
  });
});
