
ALTER TABLE public.indicators
  ADD COLUMN institution_id uuid REFERENCES public.institutions(id) ON DELETE SET NULL,
  ADD COLUMN instrument_id uuid REFERENCES public.instruments(id) ON DELETE SET NULL;
