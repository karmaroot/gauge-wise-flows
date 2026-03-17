import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';

const mockReport = {
  id: '1',
  indicator: 'Cobertura Educativa',
  description: 'Porcentaje de cobertura del sistema educativo nacional',
  institution: 'Min. Educación',
  period: 'Q1 2025',
  reported: 78,
  target: 85,
  unit: 'percentage',
  status: 'submitted' as const,
  comment: 'Se reporta un avance del 78% en la cobertura educativa nacional durante el primer trimestre.',
  created_at: '2025-01-15',
  attachments: [
    { name: 'evidencia_cobertura.pdf', type: 'PDF', size: '2.4 MB' },
    { name: 'datos_matricula.xlsx', type: 'Excel', size: '1.1 MB' },
  ],
};

const mockObservations = [
  {
    id: '1',
    user: 'María García',
    role: 'Revisor',
    comment: 'Se requiere desglose por región. La cifra global no permite validar el indicador completamente.',
    status: 'open' as const,
    created_at: '2025-01-20T10:30:00',
    responses: [
      {
        id: '1',
        user: 'Carlos López',
        role: 'Informante',
        comment: 'Adjunto desglose por región. Ver archivo adjunto con datos departamentales.',
        created_at: '2025-01-21T14:00:00',
      },
    ],
  },
];

export default function ReportDetail() {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="mb-6">
        <Link to="/reports" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a Reportes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report info */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">{mockReport.indicator}</h1>
                <p className="text-sm text-muted-foreground mt-1">{mockReport.description}</p>
              </div>
              <StatusBadge status={mockReport.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Institución</p>
                <p className="text-sm font-medium text-foreground">{mockReport.institution}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Periodo</p>
                <p className="text-sm font-medium text-foreground">{mockReport.period}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Valor Reportado</p>
                <p className="text-2xl font-semibold text-foreground">{mockReport.reported}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Meta</p>
                <p className="text-2xl font-semibold text-muted-foreground">{mockReport.target}%</p>
              </div>
            </div>

            {mockReport.comment && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground mb-2">Comentario del Informante</p>
                <p className="text-sm text-foreground">{mockReport.comment}</p>
              </div>
            )}
          </div>

          {/* Observations */}
          <div className="bg-card rounded-lg shadow-card">
            <div className="p-6 border-b">
              <h3 className="text-sm font-medium text-foreground">Observaciones</h3>
            </div>

            <div className="p-6 space-y-6">
              {mockObservations.map((obs) => (
                <div key={obs.id} className="relative">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-amber-700">{obs.user[0]}</span>
                      </div>
                      {obs.responses.length > 0 && (
                        <div className="w-px flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{obs.user}</span>
                        <span className="text-xs text-muted-foreground">{obs.role}</span>
                        <StatusBadge status={obs.status} type="observation" />
                      </div>
                      <p className="text-sm text-foreground">{obs.comment}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {new Date(obs.created_at).toLocaleString('es')}
                      </p>
                    </div>
                  </div>

                  {obs.responses.map((resp) => (
                    <div key={resp.id} className="flex gap-3 ml-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-primary">{resp.user[0]}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{resp.user}</span>
                          <span className="text-xs text-muted-foreground">{resp.role}</span>
                        </div>
                        <p className="text-sm text-foreground">{resp.comment}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                          {new Date(resp.created_at).toLocaleString('es')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Reply form */}
              <div className="pt-4 border-t">
                <Textarea placeholder="Escribir una respuesta..." className="mb-3" rows={3} />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4 mr-1" />
                    Adjuntar
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          {(mockReport.status === 'submitted' || mockReport.status === 'responded') && (
            <div className="bg-card rounded-lg shadow-card p-6 space-y-3">
              <h3 className="text-sm font-medium text-foreground mb-4">Acciones del Revisor</h3>
              <Button className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100 border-0" variant="outline">
                Crear Observación
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10 border-destructive/30">
                  Rechazar
                </Button>
                <Button className="flex-1">
                  Aprobar
                </Button>
              </div>
            </div>
          )}

          {/* Attachments */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Evidencia Adjunta</h3>
            <div className="space-y-2">
              {mockReport.attachments.map((att, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-inner bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{att.name}</p>
                    <p className="text-xs text-muted-foreground">{att.type} · {att.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Historial</h3>
            <div className="space-y-3">
              {[
                { action: 'Reporte enviado', date: '15 Ene 2025', user: 'Carlos López' },
                { action: 'Observación creada', date: '20 Ene 2025', user: 'María García' },
                { action: 'Respuesta enviada', date: '21 Ene 2025', user: 'Carlos López' },
              ].map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{event.action}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{event.date} · {event.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
