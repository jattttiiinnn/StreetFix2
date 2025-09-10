-- Add new columns for image storage
ALTER TABLE public.reports 
  ADD COLUMN image_data TEXT,
  ADD COLUMN image_mime_type TEXT;

-- Update RLS policies if needed
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reports;
CREATE POLICY "Enable read access for all users" 
  ON public.reports 
  FOR SELECT 
  USING (true);

-- Update the view to include the new columns if you have any views
