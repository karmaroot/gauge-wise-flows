import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MessageSquare } from 'lucide-react';

const mockObservations = [
  { id: '1', indicator: 'Cobertura Educativa', institution: 'Min. Educación', reviewer: 'María García', status: 'open' as const, comment: 'Se requiere desglose por región...', date: '20 Ene 2025', responses: 1 },
  { id: '2', indicator: 'Calidad Sanitaria', institution: 'Min. Salud', reviewer: 'Ana Torres', status: 'answered' as const, comment: 'Falta evidencia documental...', date: '18 Ene 2025', responses: 2 },
  { id: '3', indicator: 'Impacto Ambiental', institution: 'Min. Ambiente', reviewer: 'María García', status: 'closed' as const, comment: 'Datos inconsistentes con fuente...', date: '15 Ene 2025', responses: 3 },
];

export default function Observations() {
  return (
    <AppLayout>
      <PageHeader title="Observaciones" description="Seguimiento de observaciones de revisión" />

      <div className="space-y-4">
        {mockObservations.map((obs) => (
          <div key={obs.id} className="bg-card rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-foreground">{obs.indicator}</h3>
                <p className="text-xs text-muted-foreground">{obs.institution} · {obs.reviewer}</p>
              </div>
              <StatusBadge status={obs.status} type="observation" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{obs.comment}</p>
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {obs.responses} respuestas
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">{obs.date}</p>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
