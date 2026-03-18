import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PeriodValues {
  id?: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'open' | 'closed';
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period?: PeriodValues | null;
  onSave: (values: PeriodValues) => void;
  loading?: boolean;
}

export function PeriodDialog({ open, onOpenChange, period, onSave, loading }: Props) {
  const [form, setForm] = useState<PeriodValues>({ name: '', start_date: '', end_date: '', status: 'open' });

  useEffect(() => {
    if (period) setForm(period);
    else setForm({ name: '', start_date: '', end_date: '', status: 'open' });
  }, [period, open]);

  const set = (key: keyof PeriodValues, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: period?.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{period ? 'Editar Periodo' : 'Nuevo Periodo'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Inicio</Label>
              <Input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} required />
            </div>
            <div>
              <Label>Fin</Label>
              <Input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={v => set('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Abierto</SelectItem>
                <SelectItem value="closed">Cerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
