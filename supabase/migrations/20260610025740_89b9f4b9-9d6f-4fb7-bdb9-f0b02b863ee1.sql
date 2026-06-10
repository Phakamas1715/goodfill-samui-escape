-- Restrict sensitive partner-only columns on bookings from authenticated role.
-- Server-side code uses supabaseAdmin (service_role) for partner notifications.
REVOKE SELECT ON public.bookings FROM authenticated;
GRANT SELECT (
  id, booking_code, program_id, program_name, program_duration, program_venue,
  program_price, booking_date, meal_plan, meals_url, expert_name, dietary_notes,
  dietary_plan, status, customer_line_user_id, user_id, created_at, updated_at
) ON public.bookings TO authenticated;
-- partner_line_user_id, partner_response, partner_notes, partner_push, customer_push
-- remain accessible only to service_role.
GRANT ALL ON public.bookings TO service_role;