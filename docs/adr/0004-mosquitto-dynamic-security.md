# ADR 0004 — Autenticación MQTT con Mosquitto Dynamic Security

- **Estado:** Aceptado
- **Fecha:** 2026-11-06

## Contexto
El dispositivo no envía `tenant_id`; el servidor debe deducirlo de su identidad. En MQTT, eso exige
que el broker autentique a cada dispositivo y le restrinja los tópicos.

## Decisión
- Plugin oficial **Dynamic Security** de Mosquitto 2.x.
- Usuario MQTT = `deviceId`; contraseña = secreto de la `DeviceCredential`.
- Rol por dispositivo con ACL de publicación solo en `devices/{deviceId}/#`.
- La API administra clientes vía `$CONTROL/dynamic-security/v1` al emitir o revocar credenciales.
- La API se suscribe con un cliente de servicio propio y deduce el dispositivo del tópico.

## Alternativas descartadas
- `mosquitto-go-auth` con backend HTTP: imagen de terceros y latencia por conexión.
- Archivo passwd + ACL regenerado: frágil, requiere recargas.

## Consecuencias
- Hay dos fuentes de estado (BD y broker): la revocación debe aplicarse en ambas y se prueba en el spec 002.
- Las credenciales de admin del broker solo las conoce la API.

## Implementación (spec 000, T9)

- `infra/mosquitto/init-dynsec.sh` crea, solo si `dynamic-security.json` no existe, el admin
  (`MOSQUITTO_ADMIN_USERNAME`/`MOSQUITTO_ADMIN_PASSWORD`) y un rol fijo **`service-subscriber`**
  con ACL `subscribeLiteral` sobre `devices/+/telemetry`, asignado al cliente de servicio de la
  API (`MQTT_SERVICE_USERNAME`/`MQTT_SERVICE_PASSWORD`, el mismo que usa `createMqttServiceClient`
  en `apps/api`). El spec 002 debe reutilizar este rol para cualquier otro consumidor interno que
  necesite suscribirse a telemetría; los roles **por dispositivo** (ACL de publicación en
  `devices/{deviceId}/#`) se crean ahí, vía `$CONTROL`, no en este script.
- Detalle de permisos: Mosquitto arranca como root (para abrir el puerto) pero, sin una opción
  `user` explícita, baja privilegios al usuario `mosquitto` por defecto. El archivo que crea
  `mosquitto_ctrl dynsec init` queda `root:root 0640`, así que el script hace `chown
  mosquitto:mosquitto` sobre él antes de arrancar el broker real; si no, el plugin falla con
  "File is not readable" y el admin pierde autorización.
