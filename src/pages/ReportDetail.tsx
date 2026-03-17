import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { useReport, useObservations, useAttachments } from '@/hooks/useSupabaseQuery';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportDetail() {
  const { id } = useParams();
  const { data: report, isLoading } = useReport(id);
  const { data: observations } = useObservations(id);
  const { data: attachments } = useAttachments(id);

  if (isLoading) return (
    <AppLayout>
      <div className="space-y-4 p-6">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}</div>
    </AppLayout>
  );

  if (!report) return (
    <AppLayout>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Reporte no encontrado.</p>
        <Link to="/reports" className="text-primary text-sm hover:underline mt-2 inline-block">Volver a Reportes</Link>
      </div>
    </AppLayout>
  );

  const ind = report.indicators as any;
  const inst = report.institutions as any;
  const per = report.periods as any;
  const creator = report.profiles as any;

  return (
    <AppLayout>
      <div className="mb-6">
        <Link to="/reports" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />Volver a Reportes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg shadow-card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">{ind?.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{ind?.description}</p>
              </div>
              <StatusBadge status={report.status as any} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-xs text-muted-foreground mb-1">Institución</p><p className="text-sm font-medium text-foreground">{inst?.name}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Periodo</p><p className="text-sm font-medium text-foreground">{per?.name}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Valor Reportado</p><p className="text-2xl font-semibold text-foreground">{report.reported_value ?? '—'}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">Meta</p><p className="text-2xl font-semibold text-muted-foreground">{ind?.target_value}</p></div>
            </div>

            {report.comment && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground mb-2">Comentario del Informante</p>
                <p className="text-sm text-foreground">{report.comment}</p>
              </div>
            )}
          </div>

          {/* Observations */}
          <div className="bg-card rounded-lg shadow-card">
            <div className="p-6 border-b"><h3 className="text-sm font-medium text-foreground">Observaciones</h3></div>
            <div className="p-6 space-y-6">
              {(observations ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Sin observaciones.</p>
              ) : (
                observations!.map((obs: any) => (
                  <div key={obs.id} className="relative">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-amber-700">{obs.profiles?.name?.[0] ?? '?'}</span>
                        </div>
                        {obs.observation_responses?.length > 0 && <div className="w-px flex-1 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">{obs.profiles?.name}</span>
                          <StatusBadge status={obs.status} type="observation" />
                        </div>
                        <p className="text-sm text-foreground">{obs.comment}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 font-mono">{new Date(obs.created_at).toLocaleString('es')}</p>
                      </div>
                    </div>

                    {obs.observation_responses?.map((resp: any) => (
                      <div key={resp.id} className="flex gap-3 ml-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-primary">{resp.profiles?.name?.[0] ?? '?'}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-medium text-foreground">{resp.profiles?.name}</span>
                          <p className="text-sm text-foreground">{resp.comment}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 font-mono">{new Date(resp.created_at).toLocaleString('es')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}

              <div className="pt-4 border-t">
                <Textarea placeholder="Escribir una respuesta..." className="mb-3" rows={3} />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm"><Paperclip className="h-4 w-4 mr-1" />Adjuntar</Button>
                  <Button size="sm"><Send className="h-4 w-4 mr-1" />Responder</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {(report.status === 'submitted' || report.status === 'responded') && (
            <div className="bg-card rounded-lg shadow-card p-6 space-y-3">
              <h3 className="text-sm font-medium text-foreground mb-4">Acciones del Revisor</h3>
              <Button className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100 border-0" variant="outline">Crear Observación</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-destructive hover:bg-destructive/10 border-destructive/30">Rechazar</Button>
                <Button className="flex-1">Aprobar</Button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Evidencia Adjunta</h3>
            {(attachments ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin archivos adjuntos.</p>
            ) : (
              <div className="space-y-2">
                {attachments!.map((att: any) => (
                  <div key={att.id} className="flex items-center gap-3 p-3 rounded-inner bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                    <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{att.file_name}</p>
                      <p className="text-xs text-muted-foreground">{att.file_type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg shadow-card p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Información</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Creado por:</span> <span className="text-foreground">{creator?.name ?? '—'}</span></div>
              <div><span className="text-muted-foreground">Fecha:</span> <span className="text-foreground font-mono text-xs">{new Date(report.created_at).toLocaleDateString('es')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
