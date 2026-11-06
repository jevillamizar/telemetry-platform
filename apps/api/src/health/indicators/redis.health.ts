import type { HealthCheckResult } from "./postgres.health.js";
import { conTimeout } from "../with-timeout.js";

export interface RedisPingable {
  ping(): Promise<string>;
}

const TIMEOUT_MS_DEFAULT = 1000;

export class RedisHealthIndicator {
  constructor(private readonly client: RedisPingable) {}

  async check(timeoutMs: number = TIMEOUT_MS_DEFAULT): Promise<HealthCheckResult> {
    try {
      await conTimeout(this.client.ping(), timeoutMs);
      return { status: "up" };
    } catch {
      return { status: "down" };
    }
  }
}
