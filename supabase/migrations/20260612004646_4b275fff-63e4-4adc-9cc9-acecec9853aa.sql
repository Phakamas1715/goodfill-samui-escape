CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS bookings_program_id_idx ON public.bookings (program_id);
CREATE INDEX IF NOT EXISTS bookings_customer_line_user_id_idx ON public.bookings (customer_line_user_id);