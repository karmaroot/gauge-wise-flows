import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { BRANDING } from '@/config/branding';

type AuthView = 'login' | 'register' | 'forgot-password';

export default function AuthPage() {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Inicio de sesión exitoso');
      } else if (view === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) throw error;
        toast.success('Cuenta creada. Revisa tu email para confirmar.');
      } else if (view === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success('Enlace de recuperación enviado a tu correo');
        setView('login');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'login': return 'Iniciar Sesión';
      case 'register': return 'Crear Cuenta';
      case 'forgot-password': return 'Recuperar Contraseña';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={BRANDING.assets.logo} alt={`${BRANDING.institution.shortName} Logo`} className="h-12 w-12 rounded-lg mx-auto mb-4 object-contain shadow-sm" />
          <h1 className="text-2xl font-semibold text-foreground">{BRANDING.institution.name} {BRANDING.institution.parent}</h1>
          <p className="text-sm text-muted-foreground mt-1">{BRANDING.system.name}</p>
        </div>

        <div className="bg-card rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium text-foreground mb-6">
            {getTitle()}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'register' && (
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {view !== 'forgot-password' && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  {view === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setView('forgot-password')}
                      className="text-xs text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Procesando...' : 
               view === 'login' ? 'Ingresar' : 
               view === 'register' ? 'Registrarse' : 'Enviar instrucciones'}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            {view === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button onClick={() => setView('register')} className="text-primary font-medium hover:underline">
                  Registrarse
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button onClick={() => setView('login')} className="text-primary font-medium hover:underline">
                  Iniciar Sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
