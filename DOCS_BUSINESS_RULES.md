# Reglas de Negocio y Políticas de Seguridad (RLS)

Este documento detalla las configuraciones aplicadas directamente en Supabase para habilitar el flujo de reportabilidad corregida y gestión de evidencias.

## 1. Gestión de Reportes (indicator_reports)
Se han flexibilizado las políticas para permitir la colaboración y subrogancia:
- **Lectura**: Cualquier usuario autenticado puede ver los reportes.
- **Edición (Update)**: Un reporte puede ser editado por:
  - El creador original (`created_by`).
  - El informante asignado actualmente al indicador (vía `instrument_indicators`).
  - Revisores y Administradores.
- **Inserción**: Solo informantes asignados o administradores pueden crear nuevos reportes.

## 2. Gestión de Evidencias (attachments)
Se implementó un sistema de trazabilidad automática:
- **Columna `uploaded_by`**: Ahora tiene un valor predeterminado de `auth.uid()`. No es necesario enviarlo desde el frontend.
- **Validación de Subida**: Un usuario solo puede adjuntar archivos a reportes sobre los cuales tenga permiso de edición (dueño o asignado).

## 3. Almacenamiento (Storage: verification-documents)
Se activó RLS para el bucket de documentos de verificación:
- **Subida**: Permitida para cualquier usuario autenticado.
- **Lectura**: Permitida para cualquier usuario autenticado (requerido para que los revisores descarguen las evidencias).

## 4. Flujo de Resupresión
- Al corregir un reporte, el estado cambia automáticamente a `responded`.
- El sistema mantiene un respaldo del archivo original (histórico) si el reporte proviene de la migración inicial.
