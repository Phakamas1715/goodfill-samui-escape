
-- Column-level revoke: customers can read their booking row, but not partner-only fields.
REVOKE SELECT (partner_line_user_id, partner_push, partner_response, partner_notes)
  ON public.bookings FROM authenticated;
