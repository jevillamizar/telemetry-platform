import mqtt, { type MqttClient } from "mqtt";

export interface MqttServiceClientConfig {
  url: string;
  username: string;
  password: string;
}

export interface MqttServiceLogger {
  log(message: string): void;
  error(message: string): void;
}

export function createMqttServiceClient(
  config: MqttServiceClientConfig,
  logger: MqttServiceLogger = console,
): MqttClient {
  const client = mqtt.connect(config.url, {
    protocolVersion: 5,
    username: config.username,
    password: config.password,
    reconnectPeriod: 2000,
  });

  client.on("connect", () => {
    logger.log(`Cliente de servicio MQTT conectado como "${config.username}"`);
  });

  client.on("reconnect", () => {
    logger.log("Cliente de servicio MQTT reconectando...");
  });

  client.on("error", () => {
    logger.error("Cliente de servicio MQTT: error de conexión");
  });

  return client;
}
