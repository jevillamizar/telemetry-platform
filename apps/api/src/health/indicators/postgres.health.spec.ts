import { describe, expect, it, jest } from "@jest/globals";

import { PostgresHealthIndicator } from "./postgres.health.js";

describe("PostgresHealthIndicator", () => {
  it("responde up cuando el cliente resuelve la consulta", async () => {
    const clienteSimulado = {
      query: jest.fn<(sql: string) => Promise<unknown>>().mockResolvedValue({ rows: [{ "?column?": 1 }] }),
    };
    const indicador = new PostgresHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "up" });
    expect(clienteSimulado.query).toHaveBeenCalledWith("SELECT 1");
  });

  it("responde down cuando el cliente rechaza la consulta", async () => {
    const clienteSimulado = {
      query: jest
        .fn<(sql: string) => Promise<unknown>>()
        .mockRejectedValue(new Error("connection refused 10.0.0.5:5432")),
    };
    const indicador = new PostgresHealthIndicator(clienteSimulado);

    const resultado = await indicador.check();

    expect(resultado).toEqual({ status: "down" });
  });

  it("responde down cuando la consulta excede el timeout", async () => {
    const clienteSimulado = {
      query: jest.fn<(sql: string) => Promise<unknown>>().mockImplementation(() => new Promise(() => {})),
    };
    const indicador = new PostgresHealthIndicator(clienteSimulado);

    const resultado = await indicador.check(10);

    expect(resultado).toEqual({ status: "down" });
  });
});
