
-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Informants can insert reports" ON public.indicator_reports;

-- Recreate: allow informants to insert their own reports, AND admins to insert on behalf of others
CREATE POLICY "Informants can insert reports"
ON public.indicator_reports
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
);
