import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Building2 } from 'lucide-react';
import { INSTITUTION_TYPE_LABELS } from '@/lib/constants';
import { useInstitutions } from '@/hooks/useSupabaseQuery';
import { Skeleton } from '@/components/ui/skeleton';

export default function Institutions() {
  const { data: institutions, isLoading } = useInstitutions();

  return (
    <AppLayout>
      <PageHeader title="Instituciones" description="Gestión de instituciones del sistema">
        <Button><Plus className="h-4 w-4 mr-2" />Nueva Institución</Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(institutions ?? []).map((inst) => (
            <div key={inst.id} className="bg-card rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-primary/10 rounded-inner">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{inst.name}</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground mb-3">
                {INSTITUTION_TYPE_LABELS[inst.type as keyof typeof INSTITUTION_TYPE_LABELS]}
              </span>
              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-[10px] text-muted-foreground font-mono">{new Date(inst.created_at).toLocaleDateString('es')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
