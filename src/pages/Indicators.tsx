import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { INDICATOR_TYPE_LABELS, FREQUENCY_LABELS } from '@/lib/constants';

const mockIndicators = [
  { id: '1', name: 'Cobertura Educativa', unit: 'percentage', target: 85, type: 'quantitative' as const, frequency: 'quarterly' as const, active: true },
  { id: '2', name: 'Eficiencia Fiscal', unit: 'percentage', target: 90, type: 'quantitative' as const, frequency: 'quarterly' as const, active: true },
  { id: '3', name: 'Calidad Sanitaria', unit: 'count', target: 75, type: 'quantitative' as const, frequency: 'monthly' as const, active: true },
  { id: '4', name: 'Impacto Ambiental', unit: 'percentage', target: 80, type: 'qualitative' as const, frequency: 'annually' as const, active: false },
  { id: '5', name: 'Satisfacción Ciudadana', unit: 'percentage', target: 88, type: 'qualitative' as const, frequency: 'quarterly' as const, active: true },
];

export default function Indicators() {
  return (
    <AppLayout>
      <PageHeader title="Indicadores" description="Gestión de indicadores institucionales">
        <Button><Plus className="h-4 w-4 mr-2" />Nuevo Indicador</Button>
      </PageHeader>

      <div className="bg-card rounded-lg shadow-card">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar indicadores..." className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Nombre</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Unidad</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">Meta</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Tipo</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">Frecuencia</th>
                <th className="text-center text-xs font-medium text-muted-foreground px-6 py-3">Estado</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockIndicators.map((ind) => (
                <tr key={ind.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{ind.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{ind.unit}</td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-foreground">{ind.target}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{INDICATOR_TYPE_LABELS[ind.type]}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{FREQUENCY_LABELS[ind.frequency]}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ind.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {ind.active ? 'Activo' : 'Inactivo'}
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
