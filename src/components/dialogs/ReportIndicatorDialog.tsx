import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Paperclip, X, FileText, Calendar, Tag, Hash } from 'lucide-react';

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
    verification_file?: File | null;
  }) => void;
  loading?: boolean;
  existingReport?: any;
}

export function ReportIndicatorDialog({ open, onOpenChange, assignment, activePeriod, onSubmit, loading, existingReport }: ReportIndicatorDialogProps) {
  const [numerator, setNumerator] = useState(existingReport?.numerator?.toString() ?? '');
  const [denominator, setDenominator] = useState(existingReport?.denominator?.toString() ?? '');
  const [comment, setComment] = useState(existingReport?.comment ?? '');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const indicator = assignment?.indicators;
  const instrument = assignment?.instruments;

  const reportingMonth = activePeriod
    ? new Date(activePeriod.start_date).toLocaleDateString('es', { month: 'long', year: 'numeric' })
    : '—';

  const numVal = parseFloat(numerator);
  const denVal = parseFloat(denominator);

  const unitLower = indicator?.unit?.toLowerCase().trim() ?? '';
  const isQuantity = indicator?.indicator_type === 'quantity' || unitLower === 'cantidad';

  function computeValue(): number | null {
    if (isQuantity) return isNaN(numVal) ? null : numVal;
    if (isNaN(numVal) || isNaN(denVal) || denVal === 0) return null;
    if (unitLower.includes('%') || unitLower.includes('porcentaje') || unitLower.includes('percentage')) {
      return (numVal / denVal) * 100;
    }
    return numVal / denVal;
  }

  const computedValue = computeValue();

  function formatValue(val: number): string {
    if (unitLower.includes('%') || unitLower.includes('porcentaje') || unitLower.includes('percentage')) {
      return `${val.toFixed(2)}%`;
    }
    if (unitLower.includes('día') || unitLower.includes('days') || unitLower.includes('dias')) {
      return `${val.toFixed(1)} días`;
    }
    if (isQuantity) return `${Number.isInteger(val) ? val : val.toFixed(2)}`;
    return val.toFixed(4);
  }

  const canSubmit =
    numerator !== '' &&
    (isQuantity || (denominator !== '' && denVal > 0)) &&
    verificationFile !== null &&
    comment.trim() !== '' &&
    !loading;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setVerificationFile(file);
  }

  function handleRemoveFile() {
    setVerificationFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !activePeriod) return;
    onSubmit({
      indicator_id: assignment.indicator_id,
      institution_id: instrument?.institution_id,
      period_id: activePeriod.id,
      numerator: numVal,
      denominator: isQuantity ? 1 : denVal,
      reported_value: computedValue!,
      reporting_month: reportingMonth,
      comment,
      verification_method: verificationFile?.name ?? '',
      verification_file: verificationFile,
    });
    setNumerator('');
    setDenominator('');
    setComment('');
    setVerificationFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Wider modal, no scroll */}
      <DialogContent className="max-w-4xl w-full p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-lg">
            {existingReport ? 'Corregir y Reenviar Reporte' : 'Reportar Indicador'}
          </DialogTitle>
          <DialogDescription className="mt-1">
            {existingReport ? 'Corrige los datos según las observaciones del revisor.' : 'Completa los datos para enviar tu reporte al revisor.'}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Two-column body */}
          <div className="grid grid-cols-2 divide-x">

            {/* LEFT: Indicator metadata */}
            <div className="px-6 py-5 space-y-4 bg-muted/20">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Información del Indicador</p>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Nombre</p>
                <p className="text-sm font-semibold text-foreground leading-snug">{indicator?.name ?? '—'}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Descripción</p>
                <p className="text-sm text-foreground leading-snug">{indicator?.description ?? 'Sin descripción'}</p>
              </div>

              <div className="h-px bg-border" />

              <div className="grid grid-cols-2 gap-3 mb-1">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Mes de Reporte</p>
                  <p className="text-sm font-medium text-foreground capitalize">{reportingMonth}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Tag className="h-3 w-3" /> Unidad</p>
                  <p className="text-sm font-medium text-foreground">{indicator?.unit ?? '—'}</p>
                </div>
              </div>

              {/* Meta destacada */}
              <div className="rounded-lg border bg-background p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Meta del Indicador
                </p>
                <div className="flex items-end gap-3">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">Meta</p>
                    <p className="text-3xl font-bold text-foreground">{indicator?.target_value ?? '—'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{indicator?.unit ?? ''}</p>
                  </div>
                  <div className="text-muted-foreground text-lg font-light pb-3">vs</div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-muted-foreground mb-0.5">Avance Actual</p>
                    <p className={`text-3xl font-bold ${
                      computedValue !== null
                        ? (computedValue >= (indicator?.target_value ?? 0) ? 'text-emerald-600' : 'text-amber-500')
                        : 'text-muted-foreground'
                    }`}>
                      {computedValue !== null ? formatValue(computedValue) : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{!unitLower.includes('%') ? (indicator?.unit ?? '') : ''}</p>
                  </div>
                </div>
                {computedValue !== null && indicator?.target_value != null && (
                  <div className="mt-1">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          computedValue >= indicator.target_value ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${Math.min((computedValue / indicator.target_value) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {Math.min(((computedValue / indicator.target_value) * 100), 100).toFixed(1)}% de la meta
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Form fields */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Datos del Reporte</p>

              {/* Numeric fields */}
              {isQuantity ? (
                <div className="space-y-1.5">
                  <Label htmlFor="numerator" className="font-semibold text-sm">
                    Avance <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numerator"
                    type="number"
                    step="any"
                    placeholder="Ingresa el valor de avance"
                    value={numerator}
                    onChange={e => setNumerator(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="numerator" className="font-semibold text-sm">
                        Numerador <span className="text-destructive">*</span>
                      </Label>
                      <Input id="numerator" type="number" step="any" placeholder="0" value={numerator} onChange={e => setNumerator(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="denominator" className="font-semibold text-sm">
                        Denominador <span className="text-destructive">*</span>
                      </Label>
                      <Input id="denominator" type="number" step="any" min="1" placeholder="0" value={denominator} onChange={e => setDenominator(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-semibold text-sm">Avance Mensual</Label>
                    <div className="h-10 px-4 border rounded-md bg-primary/5 border-primary/20 text-sm font-bold flex items-center text-primary">
                      {computedValue !== null
                        ? `${formatValue(computedValue)}${!unitLower.includes('%') ? ` ${indicator?.unit ?? ''}` : ''}`
                        : <span className="text-muted-foreground font-normal text-xs">Completa numerador y denominador</span>
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Medio de Verificación */}
              <div className="space-y-1.5">
                <Label className="font-semibold text-sm">
                  Medio de Verificación <span className="text-destructive">*</span>
                </Label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-3 transition-colors cursor-pointer ${
                    verificationFile ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/40'
                  }`}
                  onClick={() => !verificationFile && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                  {verificationFile ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{verificationFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(verificationFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); handleRemoveFile(); }}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-1">
                      <Paperclip className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-foreground">Haz clic para adjuntar archivo</p>
                        <p className="text-xs text-muted-foreground">PDF, Word, Excel, imágenes</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-1.5">
                <Label htmlFor="comment" className="font-semibold text-sm">
                  Observaciones <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Describe los detalles relevantes de este reporte..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  required
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex justify-end gap-2 bg-muted/10">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {loading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
                : existingReport ? 'Reenviar Reporte' : 'Enviar Reporte'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
