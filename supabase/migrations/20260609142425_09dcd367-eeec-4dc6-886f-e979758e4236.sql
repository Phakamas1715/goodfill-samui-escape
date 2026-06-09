ALTER TABLE public.telegram_identities ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
ALTER TABLE public.telegram_messages ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;