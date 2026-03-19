import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface InstrumentValues {
  id?: string;
  name: string;
  type: string;
  description?: string;
  institution_id: string;
  is_active: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instrument?: InstrumentValues | null;
  institutionId: string;
  onSave: (values: InstrumentValues) => void;
  loading?: boolean;
}

export function InstrumentDialog({ open, onOpenChange, instrument, institutionId, onSave, loading }: Props) {
  const [form, setForm] = useState<InstrumentValues>({
    name: '', type: 'general', description: '', institution_id: institutionId, is_active: true,
  });

  useEffect(() => {
    if (instrument) {
      setForm({ ...instrument });
    } else {
      setForm({ name: '', type: 'general', description: '', institution_id: institutionId, is_active: true });
    }
  }, [instrument, open, institutionId]);

  const set = (key: keyof InstrumentValues, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: instrument?.id, institution_id: institutionId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{instrument ? 'Editar Instrumento' : 'Nuevo Instrumento'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <Label>Tipo</Label>
            <Input value={form.type} onChange={e => set('type', e.target.value)} required placeholder="Ej: encuesta, formulario, registro" />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={2} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.is_active} onCheckedChange={v => set('is_active', v)} />
            <Label>Activo</Label>
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
