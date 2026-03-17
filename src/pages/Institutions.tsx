import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal, Building2 } from 'lucide-react';
import { INSTITUTION_TYPE_LABELS } from '@/lib/constants';

const mockInstitutions = [
  { id: '1', name: 'Ministerio de Educación', type: 'public' as const, reports: 12, created_at: '2024-01-10' },
  { id: '2', name: 'Ministerio de Hacienda', type: 'public' as const, reports: 8, created_at: '2024-01-10' },
  { id: '3', name: 'Ministerio de Salud', type: 'public' as const, reports: 15, created_at: '2024-02-05' },
  { id: '4', name: 'Instituto Autónomo de Agua', type: 'autonomous' as const, reports: 5, created_at: '2024-03-01' },
  { id: '5', name: 'Hospital Regional Norte', type: 'private' as const, reports: 3, created_at: '2024-04-15' },
];

export default function Institutions() {
  return (
    <AppLayout>
      <PageHeader title="Instituciones" description="Gestión de instituciones del sistema">
        <Button><Plus className="h-4 w-4 mr-2" />Nueva Institución</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockInstitutions.map((inst) => (
          <div key={inst.id} className="bg-card rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-primary/10 rounded-inner">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{inst.name}</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground mb-3">
              {INSTITUTION_TYPE_LABELS[inst.type]}
            </span>
            <div className="flex items-center justify-between pt-3 border-t">
              <p className="text-xs text-muted-foreground">{inst.reports} reportes</p>
              <p className="text-[10px] text-muted-foreground font-mono">{inst.created_at}</p>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
