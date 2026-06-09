
-- Add expert and partner roles (must commit before use; we won't reference them in same migration)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'expert';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'partner';

-- LINE identity mapping table
CREATE TABLE IF NOT EXISTS public.line_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  line_user_id text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('customer','partner')),
  display_name text,
  picture_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (line_user_id, channel)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.line_identities TO authenticated;
GRANT ALL ON public.line_identities TO service_role;

ALTER TABLE public.line_identities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own line identity" ON public.line_identities FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage line identities" ON public.line_identities FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER line_identities_updated_at
  BEFORE UPDATE ON public.line_identities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS line_identities_user_id_idx ON public.line_identities(user_id);

-- Seed default app_config keys
INSERT INTO public.app_config (key, value, description) VALUES
  ('brand_name', '"Goodfill Care"'::jsonb, 'ชื่อแบรนด์ที่แสดงใน UI/LINE'),
  ('brand_tagline', '"Slow Wellness · Samui"'::jsonb, 'แท็กไลน์'),
  ('contact_phone', '"+66 77 000 000"'::jsonb, 'เบอร์ติดต่อ'),
  ('contact_email', '"care@goodfillcare-samui.com"'::jsonb, 'อีเมลติดต่อ'),
  ('business_hours', '{"mon_fri":"08:00-20:00","sat_sun":"09:00-18:00"}'::jsonb, 'เวลาทำการ'),
  ('default_dietary_plan', '"Signature"'::jsonb, 'แผนอาหารเริ่มต้น'),
  ('feature_flags', '{"line_login":true,"expert_review":true,"qr_redeem":true}'::jsonb, 'Feature toggles'),
  ('customer_oa_name', '"Goodfill Care"'::jsonb, 'ชื่อ LINE OA ลูกค้า'),
  ('partner_oa_name', '"Goodfill Partner"'::jsonb, 'ชื่อ LINE OA พาร์ทเนอร์')
ON CONFLICT (key) DO NOTHING;
