import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { INSTITUTION_TYPE_LABELS } from '@/lib/constants';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution?: { id: string; name: string; type: string } | null;
  onSave: (values: { id?: string; name: string; type: 'public' | 'private' | 'autonomous' }) => void;
  loading?: boolean;
}

export function InstitutionDialog({ open, onOpenChange, institution, onSave, loading }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'public' | 'private' | 'autonomous'>('public');

  useEffect(() => {
    if (institution) {
      setName(institution.name);
      setType(institution.type as any);
    } else {
      setName('');
      setType('public');
    }
  }, [institution, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: institution?.id, name, type });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{institution ? 'Editar Institución' : 'Nueva Institución'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="inst-name">Nombre</Label>
            <Input id="inst-name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={v => setType(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(INSTITUTION_TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
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
