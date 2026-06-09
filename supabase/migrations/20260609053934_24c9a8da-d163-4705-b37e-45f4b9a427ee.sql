
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ updated_at TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============ PROGRAMS ============
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  duration TEXT NOT NULL DEFAULT '',
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'THB',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.programs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published programs"
  ON public.programs FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins and staff can insert programs"
  ON public.programs FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins and staff can update programs"
  ON public.programs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE POLICY "Admins can delete programs"
  ON public.programs FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ APP CONFIG ============
CREATE TABLE public.app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.app_config TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.app_config TO authenticated;
GRANT ALL ON public.app_config TO service_role;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read config"
  ON public.app_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage config"
  ON public.app_config FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER app_config_updated_at
  BEFORE UPDATE ON public.app_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default config keys
INSERT INTO public.app_config (key, value, description) VALUES
  ('hero', '{"title":"Find your Samui state of mind","subtitle":"Personalized luxury wellness journey"}'::jsonb, 'Landing hero copy'),
  ('booking', '{"currency":"THB","line_notify":true}'::jsonb, 'Booking system defaults'),
  ('branding', '{"primary":"#0B564F","accent":"#3CB496"}'::jsonb, 'Theme colors override');
