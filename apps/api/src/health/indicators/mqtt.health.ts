import type { HealthCheckResult } from "./postgres.health";

export interface MqttConnectable {
  connected: boolean;
}

export class MqttHealthIndicator {
  constructor(private readonly client: MqttConnectable) {}

  async check(): Promise<HealthCheckResult> {
    return { status: this.client.connected ? "up" : "down" };
  }
}
