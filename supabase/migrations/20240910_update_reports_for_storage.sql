-- Remove the base64 image columns
ALTER TABLE public.reports 
  DROP COLUMN IF EXISTS image_data,
  DROP COLUMN IF EXISTS image_mime_type;

-- Add a column for the storage path
ALTER TABLE public.reports 
  ADD COLUMN image_path TEXT;

-- Update RLS policy to allow authenticated users to insert reports
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.reports;
CREATE POLICY "Enable insert for authenticated users" 
  ON public.reports 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Update read policy to allow public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reports;
CREATE POLICY "Enable read access for all users" 
  ON public.reports 
  FOR SELECT 
  USING (true);

-- Create a storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-images', 'report-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the bucket
CREATE OR REPLACE FUNCTION public.get_user_id()
RETURNS UUID
LANGUAGE SQL
AS $$
  SELECT auth.uid();
$$;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" 
  ON storage.objects FOR INSERT 
  TO authenticated
  WITH CHECK (
    bucket_id = 'report-images' AND
    (storage.foldername(name))[1] = get_user_id()::text
  );

-- Allow public read access to files
CREATE POLICY "Allow public read access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'report-images');
