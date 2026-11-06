import "reflect-metadata";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";

import { AppModule } from "../src/app.module.js";

describe("GET /api/health (e2e, dependencias reales)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication<NestExpressApplication>();
    app.setGlobalPrefix("api");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it(
    "responde 503 cuando Mosquitto todavía no está disponible, sin filtrar detalles internos",
    async () => {
      const respuesta = await request(app.getHttpServer()).get("/api/health");

      expect(respuesta.status).toBe(503);
      expect(respuesta.body.status).toBe("error");
      expect(respuesta.body.checks.postgres).toBe("up");
      expect(respuesta.body.checks.redis).toBe("up");
      expect(respuesta.body.checks.mqtt).toBe("down");

      const cuerpoComoTexto = JSON.stringify(respuesta.body);
      expect(cuerpoComoTexto).not.toMatch(/ECONNREFUSED|localhost|password|coldchain:coldchain/i);
    },
    20_000,
  );
});
