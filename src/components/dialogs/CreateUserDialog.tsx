import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROLE_LABELS } from '@/lib/constants';
import { useInstitutions } from '@/hooks/useSupabaseQuery';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: { email: string; password: string; name: string; role: string; institution_id: string | null }) => void;
  loading?: boolean;
}

export function CreateUserDialog({ open, onOpenChange, onSave, loading }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('informant');
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const { data: institutions } = useInstitutions();

  const reset = () => { setName(''); setEmail(''); setPassword(''); setRole('informant'); setInstitutionId(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ email, password, name, role, institution_id: institutionId });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required placeholder="Nombre completo" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="correo@ejemplo.com" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Mínimo 6 caracteres" />
          </div>
          <div>
            <Label>Rol</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Institución</Label>
            <Select value={institutionId ?? '_none'} onValueChange={v => setInstitutionId(v === '_none' ? null : v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Sin asignar</SelectItem>
                {(institutions ?? []).map(i => (
                  <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || !name || !email || !password}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
