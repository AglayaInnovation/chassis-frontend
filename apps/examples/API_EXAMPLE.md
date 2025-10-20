# @aglaya/api-core Example

Este ejemplo demuestra cómo usar el paquete `@aglaya/api-core` para hacer peticiones HTTP en una aplicación Next.js.

## Archivos del ejemplo

### [app/api/client.ts](app/api/client.ts)

Este archivo contiene la configuración del cliente HTTP usando `createHttpClient` de `@aglaya/api-core`.

**Características demostradas:**
- Configuración del cliente con `baseURL`
- Headers por defecto
- Métodos HTTP: GET, POST, PUT, DELETE
- Tipado fuerte con TypeScript

```typescript
import { createHttpClient } from "@aglaya/api-core";

export const jsonPlaceholderClient = createHttpClient({
  baseURL: "https://jsonplaceholder.typicode.com",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
});
```

### [app/api-demo/page.tsx](app/api-demo/page.tsx)

Página de demostración interactiva que muestra:
- Obtener una lista de posts (GET)
- Obtener un post individual (GET con parámetro)
- Crear un nuevo post (POST)
- Manejo de estados de carga
- Manejo de errores

## Ejecutar el ejemplo

1. Instalar dependencias:
```bash
yarn install
```

2. Iniciar el servidor de desarrollo:
```bash
yarn workspace example dev
```

3. Abrir el navegador en [http://localhost:3000](http://localhost:3000)

4. Navegar a "API Core Demo" para ver el ejemplo en acción

## API utilizada

Este ejemplo usa la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com/) que proporciona endpoints REST de prueba.

## Características de @aglaya/api-core

- ✅ Cliente HTTP tipado con TypeScript
- ✅ Soporte para todos los métodos HTTP (GET, POST, PUT, DELETE, PATCH)
- ✅ Headers y opciones configurables
- ✅ Soporte para autenticación (Bearer, Basic, API Key)
- ✅ Reintentos automáticos configurables
- ✅ Manejo de errores consistente
- ✅ Soporte para FormData y JSON
- ✅ Compatible con Node.js y navegadores
