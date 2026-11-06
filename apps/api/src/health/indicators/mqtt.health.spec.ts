import { MqttHealthIndicator } from "./mqtt.health";

describe("MqttHealthIndicator", () => {
  it("responde up cuando el cliente está conectado", async () => {
    const clienteSimulado = { connected: true };
    const indicador = new MqttHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "up" });
  });

  it("responde down cuando el cliente no está conectado", async () => {
    const clienteSimulado = { connected: false };
    const indicador = new MqttHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "down" });
  });
});
