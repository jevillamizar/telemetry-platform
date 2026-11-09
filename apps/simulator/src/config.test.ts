import { describe, expect, it } from "vitest";

import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("resuelve la configuración cuando MQTT_URL está definido", () => {
    const config = loadConfig({ MQTT_URL: "mqtt://mosquitto:1883" } as NodeJS.ProcessEnv);

    expect(config).toEqual({ mqttUrl: "mqtt://mosquitto:1883" });
  });

  it('lanza un error si falta "MQTT_URL"', () => {
    expect(() => loadConfig({} as NodeJS.ProcessEnv)).toThrow(/MQTT_URL/);
  });
});
