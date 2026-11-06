import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import type { Response } from "express";

import type { HealthCheckResult } from "./indicators/postgres.health.js";
import { PostgresHealthIndicator } from "./indicators/postgres.health.js";
import { RedisHealthIndicator } from "./indicators/redis.health.js";
import { MqttHealthIndicator } from "./indicators/mqtt.health.js";

export interface HealthResponseBody {
  status: "ok" | "error";
  checks: {
    postgres: HealthCheckResult["status"];
    redis: HealthCheckResult["status"];
    mqtt: HealthCheckResult["status"];
  };
}

@Controller("health")
export class HealthController {
  constructor(
    private readonly postgres: PostgresHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly mqtt: MqttHealthIndicator,
  ) {}

  @Get()
  async check(@Res() res: Response): Promise<void> {
    const [postgres, redis, mqtt] = await Promise.all([
      this.postgres.check(),
      this.redis.check(),
      this.mqtt.check(),
    ]);

    const checks = {
      postgres: postgres.status,
      redis: redis.status,
      mqtt: mqtt.status,
    };
    const todoUp = Object.values(checks).every((status) => status === "up");

    const body: HealthResponseBody = {
      status: todoUp ? "ok" : "error",
      checks,
    };

    res.status(todoUp ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).json(body);
  }
}
