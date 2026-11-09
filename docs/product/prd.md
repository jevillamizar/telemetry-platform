# PRD — TEIOT

> Redactado a partir de la definición inicial del proyecto. Pendiente: propuesta comercial (precios, planes y modelo de venta), que no existe todavía.

**TEIOT** es una plataforma de telemetría multi-tenant para sistemas IoT en general (dispositivo → lectura →
alerta por umbral, aislado por tenant). Este PRD describe su primera vertical y demo técnica: monitoreo de
cadena de frío. El modelo de dominio (tenant, sede, dispositivo, lectura, alerta) no asume refrigeración;
cualquier dispositivo que reporte una métrica numérica con umbrales encaja sin cambios de esquema.

## Problema
Las empresas con varias sedes y equipos de frío detectan tarde las excursiones de temperatura,
pierden producto y no pueden demostrar quién atendió cada incidencia ni cuándo.

## Cliente
Empresas B2B en Colombia con varias sedes y equipos: distribuidoras de alimentos, supermercados,
restaurantes multisede y almacenes refrigerados.

## Propuesta de valor
El cliente compra **tranquilidad operativa**, no tablas de datos:
- Detección temprana de excursiones de temperatura.
- Trazabilidad de la atención: quién reconoció, quién resolvió, cuándo y con qué nota.
- Visión consolidada por sede y equipo.

## Usuarios y roles
`OWNER`, `ADMIN`, `OPERATOR`, `TECHNICIAN`, `VIEWER`. La matriz de permisos se define por spec.

## Alcance del MVP (demo técnica de 3 días, viernes a domingo)
- Tenants, sedes y dispositivos (un dispositivo = un equipo con su sensor).
- Ingesta HTTP batch y MQTT 5; almacenamiento de lecturas; último valor en Redis.
- Alertas por umbral con duración e histéresis.
- Dashboard web.
- App móvil (Android) con bandeja de alertas, reconocimiento y resolución.
- Simulador de sensores.

## Fuera del MVP
Kafka, fabricación de hardware, facturación real, reportes, notificaciones push y email,
vacunas o medicamentos, otros nichos (agua, solar, agro) y piloto físico.

## Criterio de éxito de la demo
1. Un simulador envía lecturas por MQTT y HTTP para dos tenants.
2. Una excursión sostenida abre una alerta, visible en web y móvil, solo para su tenant.
3. Un operador la reconoce y la resuelve desde el móvil, y el historial queda registrado.
4. Los tests de aislamiento demuestran que el tenant A no accede a datos de B.
