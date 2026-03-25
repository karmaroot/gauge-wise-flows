ALTER TABLE public.indicator_reports 
  ADD COLUMN verification_method text,
  ADD COLUMN returned_at timestamp with time zone,
  ADD COLUMN reviewed_at timestamp with time zone;