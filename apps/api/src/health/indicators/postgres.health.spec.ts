import { PostgresHealthIndicator } from "./postgres.health";

describe("PostgresHealthIndicator", () => {
  it("responde up cuando el cliente resuelve la consulta", async () => {
    const clienteSimulado = { query: jest.fn().mockResolvedValue({ rows: [{ "?column?": 1 }] }) };
    const indicador = new PostgresHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "up" });
    expect(clienteSimulado.query).toHaveBeenCalledWith("SELECT 1");
  });

  it("responde down cuando el cliente rechaza la consulta", async () => {
    const clienteSimulado = {
      query: jest.fn().mockRejectedValue(new Error("connection refused 10.0.0.5:5432")),
    };
    const indicador = new PostgresHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "down" });
  });

  it("responde down cuando la consulta excede el timeout", async () => {
    const clienteSimulado = {
      query: jest.fn().mockImplementation(() => new Promise(() => {})),
    };
    const indicador = new PostgresHealthIndicator(clienteSimulado);

    const resultado = await indicador.check(10);

    expect(resultado).toEqual({ status: "down" });
  });
});
