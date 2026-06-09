
-- Add images array column to programs
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Storage policies for program-images bucket
-- Allow public read (we'll serve via signed URLs OR public policy)
CREATE POLICY "Public read program-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'program-images');

CREATE POLICY "Admins and staff upload program-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'program-images'
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role))
);

CREATE POLICY "Admins and staff update program-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'program-images'
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role))
);

CREATE POLICY "Admins and staff delete program-images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'program-images'
  AND (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'staff'::app_role))
);
