
-- Instruments table (types of instruments per institution)
CREATE TABLE public.instruments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Instrument-Indicator assignments with responsible users
CREATE TABLE public.instrument_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument_id uuid NOT NULL REFERENCES public.instruments(id) ON DELETE CASCADE,
  indicator_id uuid NOT NULL REFERENCES public.indicators(id) ON DELETE CASCADE,
  informant_id uuid NOT NULL REFERENCES public.profiles(id),
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id),
  periodicity text NOT NULL DEFAULT 'quarterly',
  is_active boolean NOT NULL DEFAULT true,
  auto_start boolean NOT NULL DEFAULT false,
  last_started_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(instrument_id, indicator_id)
);

-- RLS for instruments
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read instruments" ON public.instruments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage instruments" ON public.instruments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete instruments" ON public.instruments
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for instrument_indicators
ALTER TABLE public.instrument_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read instrument_indicators" ON public.instrument_indicators
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage instrument_indicators" ON public.instrument_indicators
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete instrument_indicators" ON public.instrument_indicators
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for inbox
ALTER PUBLICATION supabase_realtime ADD TABLE public.instrument_indicators;
