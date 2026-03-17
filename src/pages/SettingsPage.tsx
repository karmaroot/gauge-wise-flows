import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/shared/PageHeader';

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader title="Configuración" description="Configuración general del sistema" />
      <div className="bg-card rounded-lg shadow-card p-6">
        <p className="text-sm text-muted-foreground">Configuración del sistema próximamente.</p>
      </div>
    </AppLayout>
  );
}
