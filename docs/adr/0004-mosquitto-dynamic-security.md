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
