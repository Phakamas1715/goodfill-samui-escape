DROP POLICY IF EXISTS "Anyone can read config" ON public.app_config;
CREATE POLICY "Authenticated users can read config"
ON public.app_config
FOR SELECT
TO authenticated
USING (true);
REVOKE SELECT ON public.app_config FROM anon;