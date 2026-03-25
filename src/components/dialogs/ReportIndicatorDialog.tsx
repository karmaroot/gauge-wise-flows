import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface ReportIndicatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: any;
  activePeriod: any;
  onSubmit: (values: {
    indicator_id: string;
    institution_id: string;
    period_id: string;
    numerator: number;
    denominator: number;
    reported_value: number;
    reporting_month: string;
    comment: string;
    verification_method: string;
  }) => void;
  loading?: boolean;
  /** If provided, pre-fill for resubmission (returned report) */
  existingReport?: any;
}

export function ReportIndicatorDialog({ open, onOpenChange, assignment, activePeriod, onSubmit, loading, existingReport }: ReportIndicatorDialogProps) {
  const [numerator, setNumerator] = useState(existingReport?.numerator?.toString() ?? '');
  const [denominator, setDenominator] = useState(existingReport?.denominator?.toString() ?? '');
  const [comment, setComment] = useState(existingReport?.comment ?? '');
  const [verificationMethod, setVerificationMethod] = useState(existingReport?.verification_method ?? '');

  const indicator = assignment?.indicators;
  const instrument = assignment?.instruments;
  const institution = instrument?.institutions;

  const reportingMonth = activePeriod
    ? new Date(activePeriod.start_date).toLocaleDateString('es', { month: 'long', year: 'numeric' })
    : '—';

  const numVal = parseFloat(numerator);
  const denVal = parseFloat(denominator);

  // Auto-calculate based on unit type
  function computeValue(): number | null {
    if (isNaN(numVal) || isNaN(denVal) || denVal === 0) return null;
    const unit = indicator?.unit?.toLowerCase() ?? '';
    if (unit.includes('%') || unit.includes('porcentaje') || unit.includes('percentage')) {
      return (numVal / denVal) * 100;
    }
    return numVal / denVal;
  }

  const computedValue = computeValue();

  function formatValue(val: number): string {
    const unit = indicator?.unit?.toLowerCase() ?? '';
    if (unit.includes('%') || unit.includes('porcentaje') || unit.includes('percentage')) {
      return `${val.toFixed(2)}%`;
    }
    if (unit.includes('día') || unit.includes('days') || unit.includes('dias')) {
      return `${val.toFixed(1)} días`;
    }
    return val.toFixed(4);
  }

  const canSubmit = numerator !== '' && denominator !== '' && denVal > 0 && !loading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !activePeriod) return;
    onSubmit({
      indicator_id: assignment.indicator_id,
      institution_id: instrument?.institution_id,
      period_id: activePeriod.id,
      numerator: numVal,
      denominator: denVal,
      reported_value: computedValue!,
      reporting_month: reportingMonth,
      comment,
      verification_method: verificationMethod,
    });
    setNumerator('');
    setDenominator('');
    setComment('');
    setVerificationMethod('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingReport ? 'Corregir y Reenviar Reporte' : 'Reportar Indicador'}</DialogTitle>
          <DialogDescription>
            {existingReport ? 'Corrige los datos según las observaciones del revisor.' : 'Completa los datos para enviar tu reporte al revisor.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Nombre del Indicador</Label>
            <p className="text-sm font-medium text-foreground">{indicator?.name ?? '—'}</p>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Descripción</Label>
            <p className="text-sm text-foreground">{indicator?.description ?? 'Sin descripción'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Mes de Reporte</Label>
              <p className="text-sm font-medium text-foreground capitalize">{reportingMonth}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Institución</Label>
              <p className="text-sm font-medium text-foreground">{institution?.name ?? '—'}</p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Editable fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numerator">Numerador</Label>
              <Input id="numerator" type="number" step="any" placeholder="0" value={numerator} onChange={e => setNumerator(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="denominator">Denominador</Label>
              <Input id="denominator" type="number" step="any" min="1" placeholder="0" value={denominator} onChange={e => setDenominator(e.target.value)} required />
            </div>
          </div>

          {computedValue !== null && (
            <div className="rounded-md bg-muted px-3 py-2">
              <span className="text-xs text-muted-foreground">Valor calculado: </span>
              <span className="text-sm font-semibold text-foreground">{formatValue(computedValue)} {!indicator?.unit?.includes('%') ? indicator?.unit : ''}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="verification_method">Medio de Verificación</Label>
            <Input
              id="verification_method"
              placeholder="Ej: Informe mensual, acta de reunión, documento adjunto..."
              value={verificationMethod}
              onChange={e => setVerificationMethod(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Observaciones (opcional)</Label>
            <Textarea
              id="comment"
              placeholder="Notas adicionales sobre este reporte..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
            <Button type="submit" disabled={!canSubmit}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</> : existingReport ? 'Reenviar Reporte' : 'Enviar Reporte'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
