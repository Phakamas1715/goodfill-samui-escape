
CREATE TABLE public.telegram_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id bigint NOT NULL UNIQUE,
  tg_user_id bigint,
  username text,
  first_name text,
  last_name text,
  language_code text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  start_param text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_identities TO authenticated;
GRANT ALL ON public.telegram_identities TO service_role;
ALTER TABLE public.telegram_identities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own telegram identity"
  ON public.telegram_identities FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admin/staff manage telegram identities"
  ON public.telegram_identities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE TRIGGER telegram_identities_updated_at BEFORE UPDATE ON public.telegram_identities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.telegram_messages (
  update_id bigint PRIMARY KEY,
  chat_id bigint NOT NULL,
  tg_user_id bigint,
  text text,
  raw_update jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.telegram_messages TO authenticated;
GRANT ALL ON public.telegram_messages TO service_role;
ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin/staff read telegram messages"
  ON public.telegram_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE INDEX idx_telegram_messages_chat_id ON public.telegram_messages(chat_id);

INSERT INTO public.app_config (key, value, description) VALUES
  ('telegram_bot_username', '"goodfillcare_bot"'::jsonb, 'Telegram bot username (without @) for customer deep links')
ON CONFLICT (key) DO NOTHING;
