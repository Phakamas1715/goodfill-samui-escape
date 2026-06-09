ALTER TABLE public.line_identities ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
ALTER TABLE public.line_identities ADD COLUMN IF NOT EXISTS language_preference TEXT;