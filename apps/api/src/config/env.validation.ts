import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  REDIS_URL!: string;

  @IsString()
  @IsNotEmpty()
  MQTT_URL!: string;

  @IsOptional()
  @IsString()
  PORT?: string;

  @IsOptional()
  @IsString()
  MQTT_SERVICE_USERNAME?: string;

  @IsOptional()
  @IsString()
  MQTT_SERVICE_PASSWORD?: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validada = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errores = validateSync(validada, { skipMissingProperties: false });

  if (errores.length > 0) {
    const variables = errores.map((error) => error.property).join(", ");
    throw new Error(`Variables de entorno inválidas o faltantes: ${variables}`);
  }

  return validada;
}
