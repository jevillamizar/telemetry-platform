import { Inject, Module, type OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { Redis } from "ioredis";

import { HealthController } from "./health.controller.js";
import { PostgresHealthIndicator } from "./indicators/postgres.health.js";
import { RedisHealthIndicator } from "./indicators/redis.health.js";
import { MqttHealthIndicator } from "./indicators/mqtt.health.js";
import { createMqttServiceClient } from "../mqtt/mqtt-client.provider.js";

export const POSTGRES_POOL = "POSTGRES_POOL";
export const REDIS_CLIENT = "REDIS_CLIENT";
export const MQTT_SERVICE_CLIENT = "MQTT_SERVICE_CLIENT";

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: POSTGRES_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Pool({ connectionString: config.get<string>("DATABASE_URL") }),
    },
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis(config.get<string>("REDIS_URL")!, { lazyConnect: false, maxRetriesPerRequest: 1 }),
    },
    {
      provide: MQTT_SERVICE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createMqttServiceClient({
          url: config.get<string>("MQTT_URL")!,
          username: config.get<string>("MQTT_SERVICE_USERNAME") ?? "",
          password: config.get<string>("MQTT_SERVICE_PASSWORD") ?? "",
        }),
    },
    {
      provide: PostgresHealthIndicator,
      inject: [POSTGRES_POOL],
      useFactory: (pool: Pool) => new PostgresHealthIndicator(pool),
    },
    {
      provide: RedisHealthIndicator,
      inject: [REDIS_CLIENT],
      useFactory: (client: Redis) => new RedisHealthIndicator(client),
    },
    {
      provide: MqttHealthIndicator,
      inject: [MQTT_SERVICE_CLIENT],
      useFactory: (client: { connected: boolean }) => new MqttHealthIndicator(client),
    },
  ],
})
export class HealthModule implements OnModuleDestroy {
  constructor(
    @Inject(POSTGRES_POOL) private readonly pool: Pool,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(MQTT_SERVICE_CLIENT) private readonly mqttClient: { end: (force?: boolean) => void },
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
    this.redis.disconnect();
    this.mqttClient.end(true);
  }
}
