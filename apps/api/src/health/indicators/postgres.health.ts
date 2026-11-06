import { conTimeout } from "../with-timeout.js";

export interface PostgresQueryable {
  query(sql: string): Promise<unknown>;
}

export interface HealthCheckResult {
  status: "up" | "down";
}

const TIMEOUT_MS_DEFAULT = 1000;

export class PostgresHealthIndicator {
  constructor(private readonly client: PostgresQueryable) {}

  async check(timeoutMs: number = TIMEOUT_MS_DEFAULT): Promise<HealthCheckResult> {
    try {
      await conTimeout(this.client.query("SELECT 1"), timeoutMs);
      return { status: "up" };
    } catch {
      return { status: "down" };
    }
  }
}
