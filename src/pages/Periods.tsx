import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';

const mockPeriods = [
  { id: '1', name: 'Q1 2025', start: '2025-01-01', end: '2025-03-31', status: 'open' as const, reports: 42 },
  { id: '2', name: 'Q4 2024', start: '2024-10-01', end: '2024-12-31', status: 'closed' as const, reports: 38 },
  { id: '3', name: 'Q3 2024', start: '2024-07-01', end: '2024-09-30', status: 'closed' as const, reports: 35 },
  { id: '4', name: 'Q2 2024', start: '2024-04-01', end: '2024-06-30', status: 'closed' as const, reports: 28 },
];

export default function Periods() {
  return (
    <AppLayout>
      <PageHeader title="Periodos de Reporte" description="Gestión de periodos de evaluación">
        <Button><Plus className="h-4 w-4 mr-2" />Nuevo Periodo</Button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Periodo</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Inicio</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Fin</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Reportes</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Estado</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockPeriods.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.start}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.end}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-foreground">{p.reports}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {p.status === 'open' ? 'Abierto' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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
