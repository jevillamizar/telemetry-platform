export interface SimulatorConfig {
  mqttUrl: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SimulatorConfig {
  const mqttUrl = env.MQTT_URL;
  if (!mqttUrl) {
    throw new Error('falta la variable de entorno "MQTT_URL"');
  }

  return { mqttUrl };
}
