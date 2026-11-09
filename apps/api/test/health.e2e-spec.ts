import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import type { MqttClient } from "mqtt";

import { AppModule } from "../src/app.module.js";
import { MQTT_SERVICE_CLIENT } from "../src/health/health.module.js";

async function esperarConexionMqtt(client: MqttClient): Promise<void> {
  if (client.connected) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const temporizador = setTimeout(() => reject(new Error("mqtt no conectó a tiempo en el test")), 5_000);
    client.once("connect", () => {
      clearTimeout(temporizador);
      resolve();
    });
  });
}

describe("GET /api/health (e2e, dependencias reales)", () => {
  describe("con las tres dependencias arriba y credenciales válidas", () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
      app = moduleRef.createNestApplication<NestExpressApplication>();
      app.setGlobalPrefix("api");
      await app.init();

      await esperarConexionMqtt(app.get<MqttClient>(MQTT_SERVICE_CLIENT));
    }, 20_000);

    afterAll(async () => {
      await app.close();
    });

    it("responde 200 con status ok", async () => {
      const respuesta = await request(app.getHttpServer()).get("/api/health");

      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toEqual({
        status: "ok",
        checks: { postgres: "up", redis: "up", mqtt: "up" },
      });
    });
  });

  describe("cuando una dependencia no es alcanzable (Redis, simulado con un puerto cerrado)", () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
        .overrideProvider(ConfigService)
        .useValue({
          get: (key: string) => (key === "REDIS_URL" ? "redis://localhost:9" : process.env[key]),
        } as ConfigService)
        .compile();
      app = moduleRef.createNestApplication<NestExpressApplication>();
      app.setGlobalPrefix("api");
      await app.init();

      await esperarConexionMqtt(app.get<MqttClient>(MQTT_SERVICE_CLIENT));
    }, 20_000);

    afterAll(async () => {
      await app.close();
    });

    it(
      "responde 503 sin filtrar detalles internos",
      async () => {
        const respuesta = await request(app.getHttpServer()).get("/api/health");

        expect(respuesta.status).toBe(503);
        expect(respuesta.body.status).toBe("error");
        expect(respuesta.body.checks.postgres).toBe("up");
        expect(respuesta.body.checks.redis).toBe("down");
        expect(respuesta.body.checks.mqtt).toBe("up");

        const cuerpoComoTexto = JSON.stringify(respuesta.body);
        expect(cuerpoComoTexto).not.toMatch(/ECONNREFUSED|localhost|password|coldchain:coldchain/i);
      },
      20_000,
    );
  });
});
