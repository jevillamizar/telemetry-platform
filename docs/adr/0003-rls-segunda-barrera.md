# ADR 0003 — RLS en PostgreSQL como segunda barrera de aislamiento

- **Estado:** Aceptado
- **Fecha:** 2026-11-06

## Contexto
La primera barrera son los repositorios tenant-scoped. Un error de programación (una query sin filtro)
podría filtrar datos entre tenants.

## Decisión
- RLS con `FORCE` en todas las tablas operativas, con política por `current_setting('app.tenant_id')`.
- La app usa un rol sin `BYPASSRLS`. Cada transacción fija `app.tenant_id` con `set_config(..., true)`.
- FKs compuestas `(tenant_id, id)` para impedir relaciones cruzadas.

## Consecuencias
- Una query olvidada devuelve vacío en vez de datos ajenos.
- Todo acceso a Prisma pasa por una transacción con contexto; hay un pequeño costo de rendimiento.
- Login y autenticación de dispositivo necesitan un camino controlado previo al tenant (se documenta en los specs 001 y 002).
