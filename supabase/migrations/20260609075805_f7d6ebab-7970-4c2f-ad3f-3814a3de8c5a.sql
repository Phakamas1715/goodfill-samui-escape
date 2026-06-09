
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code TEXT NOT NULL UNIQUE,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  program_duration TEXT NOT NULL,
  program_venue TEXT NOT NULL,
  program_price NUMERIC NOT NULL DEFAULT 0,
  booking_date TEXT NOT NULL,
  meal_plan JSONB NOT NULL DEFAULT '[]'::jsonb,
  meals_url TEXT,
  expert_name TEXT,
  customer_line_user_id TEXT,
  partner_line_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  partner_response JSONB NOT NULL DEFAULT '{}'::jsonb,
  partner_notes TEXT,
  customer_push JSONB NOT NULL DEFAULT '{}'::jsonb,
  partner_push JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and staff can view bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins and staff can update bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role));

CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX bookings_status_idx ON public.bookings(status);
CREATE INDEX bookings_created_at_idx ON public.bookings(created_at DESC);
CREATE INDEX bookings_partner_line_user_id_idx ON public.bookings(partner_line_user_id);
