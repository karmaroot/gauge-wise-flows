# Memoria Técnica - SGI (Sistema de Gestión de Indicadores)

## 1. Arquitectura del Sistema
El sistema **SGI** está diseñado bajo una arquitectura moderna de Aplicación de Página Única (SPA) con un backend desacoplado basado en servicios (BaaS).

- **Frontend**: Aplicación en React con TypeScript, utilizando Vite como motor de compilación.
- **Backend-as-a-Service**: Supabase para la persistencia de datos, autenticación y almacenamiento de archivos.
- **Seguridad**: Implementación de Row Level Security (RLS) directamente en la base de datos para garantizar el cumplimiento de las reglas de negocio a nivel de servidor.

## 2. Tecnologías y Librerías Core
- **Lenguaje**: TypeScript (Tipado fuerte para robustez del código).
- **Frontend Framework**: React 18+.
- **Gestión de Datos**: TanStack Query (React Query) para sincronización de estado y caché.
- **Interfaz de Usuario**: Tailwind CSS (estilos ultra-rápidos) y componentes basados en Radix UI.
- **Iconografía**: Lucide React.
- **Comunicación**: Cliente Supabase JS con soporte para WebSockets (Realtime).

## 3. Modelo de Datos y Lógica de Negocio
El sistema opera sobre un esquema relacional optimizado que incluye:
- **instrument_indicators**: Tabla maestra de asignaciones y periodicidades.
- **indicator_reports**: Registro central de datos reportados, estados de flujo y valores calculados.
- **attachments**: Gestión de punteros a archivos de evidencia subidos a buckets protegidos.
- **observations**: Log de interacciones y trazabilidad de rechazos técnicos.

## 4. Implementación de Seguridad
La lógica de protección de la propiedad de los datos no reside en el cliente, sino en las políticas de la base de datos:
- **Políticas de Inserción**: Verifican que el usuario insertando sea el informante designado para ese indicador específico.
- **Políticas de Visualización**: Filtran los datos para que el informante solo vea su propia gestión y el revisor solo lo que le corresponde auditar.
- **Control de Almacenamiento**: Los archivos solo son subibles por el dueño del reporte, evitando manipulaciones externas.

## 5. Escalabilidad y Mantenibilidad
El código sigue patrones de diseño modernos, separando la lógica de presentación de la lógica de datos mediante Hooks personalizados (`useInstruments`, `useSupabaseMutations`, etc.), permitiendo una evolución modular del sistema.
