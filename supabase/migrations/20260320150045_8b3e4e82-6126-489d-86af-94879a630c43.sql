ALTER TABLE public.indicator_reports 
ADD COLUMN IF NOT EXISTS numerator numeric NULL,
ADD COLUMN IF NOT EXISTS denominator numeric NULL,
ADD COLUMN IF NOT EXISTS reporting_month text NULL;