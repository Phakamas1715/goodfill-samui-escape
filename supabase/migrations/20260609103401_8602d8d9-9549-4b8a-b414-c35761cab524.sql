DROP POLICY IF EXISTS "Authenticated users can read config" ON public.app_config;
CREATE POLICY "Admins and staff can read config" ON public.app_config
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));