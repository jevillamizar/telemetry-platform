process.env.DATABASE_URL ??= "postgresql://teiot:teiot@localhost:5432/teiot";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.MQTT_URL ??= "mqtt://localhost:1883";
process.env.MQTT_SERVICE_USERNAME ??= "api-service";
process.env.MQTT_SERVICE_PASSWORD ??= "dev-service-secret";
