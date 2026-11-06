# Estándares de frontend (web y móvil)

Lee primero `docs/base-standards.md`.

## Común
- TypeScript estricto. Cliente de API tipado a partir de `docs/api-spec.yml`; la herramienta se elige en el spec 005.
- **Nunca** se envía `tenant_id` al backend. El tenant activo lo determina el token y la membresía.
  Si un usuario tiene varias membresías, el cambio de tenant usa un endpoint de auth dedicado.
- La UI oculta acciones según el rol, pero la autorización real siempre está en el backend.
- Textos de la interfaz en español (Colombia). Fechas en `America/Bogota`, temperatura en °C.
- Estados obligatorios en cada vista: cargando, vacío, error y sin permiso.
- El foco del producto es la tranquilidad operativa: primero las excursiones activas, después los datos.

## Web (`apps/web`): React + Vite
- Estructura por features (`src/features/<feature>`), con componentes, hooks y servicio de API.
- Estado de servidor con una librería de caché de queries (se decide en el spec 005).
- Bandeja de alertas con refresco por polling o SSE (ADR 0006).
- **Playwright** para E2E: login, ver dashboard, reconocer y resolver alerta, y un test de que el tenant A no ve datos de B.

## Móvil (`apps/mobile`): React Native + Expo + Expo Router
- Android primero. Rutas con Expo Router (`app/`).
- Token en `expo-secure-store`, nunca en AsyncStorage plano.
- Pantallas del MVP: login, bandeja de alertas, detalle de alerta, reconocer y resolver con nota.
- Sin push en el MVP (ADR 0006): bandeja con refresco al abrir la app y por intervalo en primer plano.
- Tests de componentes con Jest y React Native Testing Library.
