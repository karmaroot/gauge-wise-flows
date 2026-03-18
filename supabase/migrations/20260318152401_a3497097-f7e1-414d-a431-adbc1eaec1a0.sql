-- Allow admins to delete institutions, indicators, periods
CREATE POLICY "Admins can delete institutions" ON public.institutions FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete indicators" ON public.indicators FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete periods" ON public.periods FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
