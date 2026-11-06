import { describe, expect, it, jest } from "@jest/globals";
import type { Response } from "express";

import { HealthController } from "./health.controller.js";
import type { HealthCheckResult } from "./indicators/postgres.health.js";

function indicadorFalso(status: HealthCheckResult["status"]) {
  return { check: jest.fn<() => Promise<HealthCheckResult>>().mockResolvedValue({ status }) };
}

function responseFalso() {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
  };
  res.status.mockReturnValue(res);
  return res as unknown as Response;
}

describe("HealthController", () => {
  it("responde 200 y status ok cuando las tres dependencias están up", async () => {
    const controller = new HealthController(
      indicadorFalso("up") as never,
      indicadorFalso("up") as never,
      indicadorFalso("up") as never,
    );
    const res = responseFalso();

    await controller.check(res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "ok",
      checks: { postgres: "up", redis: "up", mqtt: "up" },
    });
  });

  it("responde 503 y status error cuando una dependencia está down", async () => {
    const controller = new HealthController(
      indicadorFalso("up") as never,
      indicadorFalso("down") as never,
      indicadorFalso("up") as never,
    );
    const res = responseFalso();

    await controller.check(res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      checks: { postgres: "up", redis: "down", mqtt: "up" },
    });
  });
});
