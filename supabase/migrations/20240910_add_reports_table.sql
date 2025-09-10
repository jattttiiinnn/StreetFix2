-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  image_data TEXT, -- Store base64 encoded image data
  image_mime_type TEXT, -- Store the MIME type of the image
  location TEXT,
  address TEXT,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  confidence DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for reports table
CREATE POLICY "Enable read access for all users" 
ON public.reports FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.reports FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for report owners"
ON public.reports FOR UPDATE
USING (auth.uid() = reporter_id)
WITH CHECK (auth.uid() = reporter_id);

-- Create storage bucket for report images
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-images', 'report-images', true)
ON CONFLICT (name) DO NOTHING;

-- Set up storage policies
CREATE OR REPLACE FUNCTION public.create_storage_policies()
RETURNS void AS $$
BEGIN
  -- Allow public read access to report images
  CREATE POLICY "Public Access" ON storage.objects FOR SELECT 
  USING (bucket_id = 'report-images');
  
  -- Allow authenticated users to upload files
  CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'report-images');
  
  -- Users can only update/delete their own files
  CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE
  USING (auth.uid() = owner)
  WITH CHECK (bucket_id = 'report-images' AND auth.uid() = owner);
  
  CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE
  USING (auth.uid() = owner AND bucket_id = 'report-images');
  
  EXCEPTION WHEN OTHERS THEN
    -- Ignore if policies already exist
    RAISE NOTICE 'Policies already exist, skipping...';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to create policies
SELECT public.create_storage_policies();

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create an index for faster queries on reporter_id
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);

-- Create an index for status filtering
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- Create an index for category filtering
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);

-- Create an index for priority filtering
CREATE INDEX IF NOT EXISTS idx_reports_priority ON public.reports(priority);
