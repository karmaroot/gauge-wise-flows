# Muestra de Cuerpo de la Obra (Código Fuente) - SGI

Este documento contiene una descripción de la estructura del código fuente del **Sistema de Gestión de Indicadores (SGI)** y una selección de los componentes que contienen la lógica original para propósitos de registro de propiedad intelectual.

## 1. Estructura de Archivos Core
A continuación se listan los archivos que contienen la lógica central de negocio desarrollada originalmente para este sistema:

### 1.1. Lógica de Sincronización y Datos (Hooks)
- `src/hooks/useSupabaseMutations.ts`: Implementación de los flujos de creación, actualización y reenvío de reportes.
- `src/hooks/useInstruments.ts`: Gestión de las asignaciones y periodicidades.
- `src/hooks/useAuth.tsx`: Sistema de gestión de sesiones y roles.

### 1.2. Componentes de Interfaz y Procesos (Dialogs)
- `src/components/dialogs/ReportIndicatorDialog.tsx`: Proceso de carga de datos y evidencias.
- `src/components/dialogs/ReviewReportDialog.tsx`: Lógica de validación técnica y respuesta.
- `src/components/dialogs/AssignIndicatorDialog.tsx`: Administración de asignaciones.

### 1.3. Vistas Principales (Pages)
- `src/pages/Inbox.tsx`: Bandeja de entrada con lógica de filtrado por estados de reportabilidad.
- `src/pages/Dashboard.tsx`: Motor de cálculo estadístico para metas y avances.

## 2. Ejemplo de Implementación (Lógica de Reenvío)
*Nota: Este es un extracto representativo de la lógica original del sistema.*

```typescript
// Fragmento de lógica de reenvío de reportes (SGI Core)
export const resubmitReport = async (values) => {
  const { data, error } = await supabase
    .from('indicator_reports')
    .update({
      status: 'responded',
      numerator: values.numerator,
      denominator: values.denominator,
      reported_value: values.reportedValue,
      comment: values.comment,
      updated_at: new Date().toISOString()
    })
    .eq('id', values.reportId);

  if (error) throw error;
  return data;
};
```

## 3. Seguridad a Nivel de Servidor (RLS)
La obra incluye un conjunto de políticas de seguridad complejas que garantizan la integridad de la información según el rol del usuario, implementadas directamente en Postgres.

---
**IMPORTANTE**: El código fuente íntegro se encuentra disponible en el repositorio local para ser entregado en soporte digital (ZIP) según los requerimientos del DDI.
