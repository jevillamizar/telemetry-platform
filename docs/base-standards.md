# Estándares base (fuente única de verdad)

Este documento prevalece sobre cualquier otro. Si un spec, agente o skill lo contradice, gana este archivo
y la contradicción se reporta.

## 1. Seguridad multi-tenant (no negociable)

**Criterio crítico:** un usuario de la empresa A no puede consultar, modificar, eliminar ni exportar datos
de la empresa B, aunque manipule IDs, parámetros HTTP, headers, cuerpos o identificadores de dispositivo.

1. **Tenant desde la autenticación.** El tenant activo se resuelve a partir del usuario autenticado y su
   `Membership`. Nunca se acepta `tenant_id` enviado por el cliente (query, body, path ni header) como fuente
   de autorización.
2. **El dispositivo no envía `tenant_id`.** El servidor lo deduce de la `DeviceCredential` (HTTP) o de la
   identidad MQTT autenticada por Mosquitto Dynamic Security (usuario MQTT = `deviceId`). Si el payload trae
   `tenant_id` o un `deviceId` distinto al autenticado, se rechaza.
3. **Repositorios tenant-scoped.** Toda consulta de datos operativos recibe el `tenantId` autorizado como
   parámetro obligatorio. Prohibido `findUnique({ where: { id } })` sin filtro de tenant.
4. **RLS en PostgreSQL como segunda barrera.** Tablas operativas con `ENABLE` y `FORCE ROW LEVEL SECURITY`,
   política por `current_setting('app.tenant_id')`. La app se conecta con un rol sin `BYPASSRLS`.
5. **Foreign keys compuestas** `(tenant_id, <entidad>_id)` para impedir relaciones entre tenants distintos.
6. **Roles:** `OWNER`, `ADMIN`, `OPERATOR`, `TECHNICIAN`, `VIEWER`, aplicados con `RolesGuard`.
   La matriz de permisos se define en cada spec.
7. **Tests IDOR/BOLA obligatorios.** Cada spec incluye tests de integración con dos tenants (A y B) que
   prueban lectura, modificación, borrado, exportación y suplantación de dispositivo cruzados.
   Respuesta esperada ante recurso de otro tenant: **404** (no revelar existencia).

Todas las entidades operativas llevan `tenant_id`.

## 2. Forma de trabajo
- **Pasos pequeños y cambios incrementales.** Una tarea del spec por vez; cada tarea deja el repo en verde.
- **TDD:** test fallido primero → implementación mínima → test verde → refactor.
- **Cobertura ≥ 90%** (líneas y ramas) en servicios y en el motor de reglas. Controladores cubiertos por tests de integración.
- Nada fuera del spec. Si hace falta, se detiene y se reporta.

## 3. Código
- TypeScript en modo `strict` (incluye `noUncheckedIndexedAccess`). Sin `any` implícito ni `@ts-ignore` sin justificación.
- Nombres descriptivos en inglés; sin abreviaturas crípticas.
- Validación en el borde (DTOs); el dominio confía en datos ya validados.
- Errores con tipos explícitos; sin `catch` vacíos.
- Comentarios en español, solo para explicar el porqué.

## 4. Idioma
Docs, specs, comentarios y mensajes de commit en español. Identificadores, módulos, rutas de API, tablas y columnas en inglés.

## 5. Commits
Conventional Commits: tipo y alcance en inglés, descripción en español, imperativo.
Ejemplo: `feat(devices): agrega emisión de credenciales de dispositivo`.
Un commit por tarea completada en verde.

## 6. Versiones fijadas
| Herramienta | Versión |
|---|---|
| Node | 22.22.3 (`.nvmrc` y `engines`) |
| pnpm | 10.20.0 (`packageManager`, vía corepack) |
| MQTT | 5, Eclipse Mosquitto 2.x con Dynamic Security |

Las versiones de NestJS, Prisma, React, Vite, Expo y librerías se **verifican y fijan en el spec 000**;
no se asumen.

## 7. Alcance del MVP
Entra: tenants, sedes, dispositivos, ingesta HTTP batch y MQTT, lecturas, último valor en Redis,
alertas por umbral (duración e histéresis), dashboard web, app móvil con bandeja de alertas,
reconocimiento y resolución, simulador de sensores.

No entra: Kafka, hardware, facturación real (`billing`), reportes (`reports`), push y email,
vacunas o medicamentos, otros nichos, piloto físico.
