-- Enable Row Level Security on storage.objects if not already enabled
CREATE OR REPLACE FUNCTION public.enable_rls_on_storage_objects()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
  ) THEN
    RAISE EXCEPTION 'storage.objects table does not exist. Make sure Supabase Storage is enabled.';
  END IF;
  
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a policy to allow public read access to the bucket
CREATE OR REPLACE FUNCTION public.create_public_read_policy(bucket_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE POLICY "Public Access" ON storage.objects 
     FOR SELECT USING (
       bucket_id = %L 
       AND (storage.foldername(name))[1] = %L
     )',
    bucket_name,
    'report-images'
  );
  RETURN;
EXCEPTION WHEN duplicate_object THEN
  -- Policy already exists, update it
  EXECUTE format(
    'ALTER POLICY "Public Access" ON storage.objects 
     USING (bucket_id = %L AND (storage.foldername(name))[1] = %L)',
    bucket_name,
    'report-images'
  );
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a policy to allow authenticated users to upload files
CREATE OR REPLACE FUNCTION public.create_upload_policy(bucket_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format(
    'CREATE POLICY "Authenticated users can upload files" 
     ON storage.objects FOR INSERT 
     TO authenticated
     WITH CHECK (
       bucket_id = %L
     )',
    bucket_name
  );
  RETURN;
EXCEPTION WHEN duplicate_object THEN
  -- Policy already exists, update it
  EXECUTE format(
    'ALTER POLICY "Authenticated users can upload files" 
     ON storage.objects 
     WITH CHECK (bucket_id = %L)',
    bucket_name
  );
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
