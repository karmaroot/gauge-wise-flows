import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/EmptyState';
import { Plus, Search, FileBarChart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReportStatus } from '@/types/database';

const mockReports = [
  { id: '1', indicator: 'Cobertura Educativa', institution: 'Min. Educación', period: 'Q1 2025', reported: 78, target: 85, status: 'submitted' as ReportStatus },
  { id: '2', indicator: 'Eficiencia Fiscal', institution: 'Min. Hacienda', period: 'Q1 2025', reported: 92, target: 90, status: 'approved' as ReportStatus },
  { id: '3', indicator: 'Calidad Sanitaria', institution: 'Min. Salud', period: 'Q1 2025', reported: 70, target: 75, status: 'observed' as ReportStatus },
  { id: '4', indicator: 'Impacto Ambiental', institution: 'Min. Ambiente', period: 'Q1 2025', reported: 65, target: 80, status: 'draft' as ReportStatus },
  { id: '5', indicator: 'Satisfacción Ciudadana', institution: 'Min. Interior', period: 'Q1 2025', reported: 85, target: 88, status: 'responded' as ReportStatus },
  { id: '6', indicator: 'Ejecución Presupuestaria', institution: 'Min. Hacienda', period: 'Q1 2025', reported: 95, target: 90, status: 'approved' as ReportStatus },
  { id: '7', indicator: 'Tasa de Alfabetización', institution: 'Min. Educación', period: 'Q1 2025', reported: 88, target: 92, status: 'rejected' as ReportStatus },
];

export default function Reports() {
  return (
    <AppLayout>
      <PageHeader title="Reportes de Indicadores" description="Gestión y seguimiento de reportes por periodo">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Reporte
        </Button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-card">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar reportes..." className="pl-9" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Indicador</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Institución</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Periodo</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Reportado</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Meta</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Estado</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockReports.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{r.indicator}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.institution}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{r.period}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-foreground">{r.reported}</td>
                  <td className="px-6 py-4 text-sm text-right text-muted-foreground">{r.target}</td>
                  <td className="px-6 py-4 text-center"><StatusBadge status={r.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/reports/${r.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
