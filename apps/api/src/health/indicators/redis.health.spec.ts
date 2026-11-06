import { RedisHealthIndicator } from "./redis.health";

describe("RedisHealthIndicator", () => {
  it("responde up cuando el cliente resuelve PONG", async () => {
    const clienteSimulado = { ping: jest.fn().mockResolvedValue("PONG") };
    const indicador = new RedisHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "up" });
    expect(clienteSimulado.ping).toHaveBeenCalled();
  });

  it("responde down cuando el cliente rechaza el ping", async () => {
    const clienteSimulado = {
      ping: jest.fn().mockRejectedValue(new Error("ECONNREFUSED 10.0.0.6:6379")),
    };
    const indicador = new RedisHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "down" });
  });

  it("responde down cuando el ping excede el timeout", async () => {
    const clienteSimulado = {
      ping: jest.fn().mockImplementation(() => new Promise(() => {})),
    };
    const indicador = new RedisHealthIndicator(clienteSimulado);

    const resultado = await indicador.check(10);

    expect(resultado).toEqual({ status: "down" });
  });
});
