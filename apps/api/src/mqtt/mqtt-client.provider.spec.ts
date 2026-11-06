import { beforeEach, describe, expect, it, jest } from "@jest/globals";

function crearClienteFalso() {
  const handlers: Record<string, (...args: unknown[]) => void> = {};
  return {
    connected: false,
    on: jest.fn((evento: string, callback: (...args: unknown[]) => void) => {
      handlers[evento] = callback;
    }),
    emit(evento: string, ...args: unknown[]) {
      handlers[evento]?.(...args);
    },
  };
}

const connectMock = jest.fn();

jest.unstable_mockModule("mqtt", () => ({
  default: { connect: connectMock },
}));

const { createMqttServiceClient } = await import("./mqtt-client.provider.js");

describe("createMqttServiceClient", () => {
  const config = {
    url: "mqtt://mosquitto:1883",
    username: "api-service",
    password: "secreto-super-sensible",
  };

  beforeEach(() => {
    connectMock.mockReset();
  });

  it("se conecta con MQTT 5 y las credenciales del cliente de servicio", () => {
    const clienteFalso = crearClienteFalso();
    connectMock.mockReturnValue(clienteFalso);

    createMqttServiceClient(config);

    expect(connectMock).toHaveBeenCalledWith(
      config.url,
      expect.objectContaining({
        protocolVersion: 5,
        username: config.username,
        password: config.password,
      }),
    );
  });

  it("registra la conexión exitosa sin imprimir la contraseña", () => {
    const clienteFalso = crearClienteFalso();
    connectMock.mockReturnValue(clienteFalso);
    const logger = { log: jest.fn(), error: jest.fn() };

    createMqttServiceClient(config, logger);
    clienteFalso.emit("connect");

    expect(logger.log).toHaveBeenCalled();
    const mensajes = logger.log.mock.calls.flat().join(" ");
    expect(mensajes).not.toContain(config.password);
  });

  it("registra un error de conexión sin imprimir la contraseña ni la URL con credenciales", () => {
    const clienteFalso = crearClienteFalso();
    connectMock.mockReturnValue(clienteFalso);
    const logger = { log: jest.fn(), error: jest.fn() };

    createMqttServiceClient(config, logger);
    clienteFalso.emit("error", new Error("ECONNREFUSED"));

    expect(logger.error).toHaveBeenCalled();
    const mensajes = logger.error.mock.calls.flat().join(" ");
    expect(mensajes).not.toContain(config.password);
  });
});
