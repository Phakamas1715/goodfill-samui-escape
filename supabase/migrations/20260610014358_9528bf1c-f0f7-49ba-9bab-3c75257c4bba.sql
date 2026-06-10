
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (user_id IS NOT NULL AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
CREATE POLICY "Users can insert their own bookings"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
