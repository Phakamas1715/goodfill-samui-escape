ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS dietary_plan text,
  ADD COLUMN IF NOT EXISTS dietary_notes text;