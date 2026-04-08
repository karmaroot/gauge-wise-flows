# SGVI – Sistema de Gestión y Validación de Indicadores

**ÁREA DE GESTIÓN ESTRATÉGICA (AGE) - COMISIÓN NACIONAL DE RIEGO**

## Resumen del Proyecto

Este sistema es una plataforma integral para la gestión, reporte y validación de indicadores de gestión interna. Facilita la trazabilidad total del ciclo de reportabilidad, desde la carga inicial de datos por los informantes hasta la aprobación técnica por parte del equipo de revisión (AGE).

## Roles del Sistema

- **Informante**: Responsable de ingresar los datos mensuales/trimestrales y adjuntar los medios de verificación requeridos. Puede corregir reportes observados por el revisor.
- **Revisor**: Encargado de validar la información y los medios de verificación. Puede aprobar reportes o devolverlos con observaciones técnicas.
- **Administrador**: Gestión de usuarios, perfiles, periodos de reporte e instrumentos/indicadores.

## Características Principales

- **Gestión de Evidencias**: Sistema de carga de archivos integrado con Supabase Storage (bucket `verification-documents`).
- **Trazabilidad de Observaciones**: Hilo de comunicación entre informante e revisor para la corrección de datos.
- **Cálculos Automáticos**: Validación en tiempo real de metas programadas vs. avances reportados.
- **Seguridad Robusta**: Control de acceso basado en roles y políticas de seguridad a nivel de fila (RLS) en tiempo real.
- **Diseño Moderno**: Interfaz construida con React y Tailwind CSS, enfocada en la usabilidad y eficiencia.

## Tecnologías Utilizadas

- **Frontend**: React.js, TypeScript, Vite.
- **Estilos**: Tailwind CSS, Shadcn UI, Lucide Icons.
- **Backend & Auth**: Supabase (Auth, Database, Storage).
- **Gestión de Estado**: TanStack Query (React Query).

## Reglas de Negocio

Para más detalles sobre las reglas de seguridad y políticas aplicadas al servidor, consulte el archivo: [DOCS_BUSINESS_RULES.md](./DOCS_BUSINESS_RULES.md).

## Instalación y Desarrollo

1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar dependencias.
3. Configurar variables de entorno en `.env` (Supabase URL y Anon Key).
4. Ejecutar `npm run dev` para iniciar el servidor de desarrollo local.

## Creador

**Marcelo Silva Magna**  
Ingeniero en Informática y consultor de negocios
