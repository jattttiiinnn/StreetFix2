import { supabase } from '../lib/supabase/client';

console.log('Initializing Supabase Storage...');

async function initStorage() {
  console.log('Initializing Supabase Storage...');

  try {
    // Check if the bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      throw bucketsError;
    }

    const bucketExists = buckets.some(bucket => bucket.name === 'report-images');

    if (!bucketExists) {
      console.log('Creating report-images bucket...');
      const { error: createError } = await supabase.storage.createBucket('report-images', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });

      if (createError) {
        throw createError;
      }
      console.log('Created report-images bucket');
    } else {
      console.log('report-images bucket already exists');
    }

    // Set bucket policies
    console.log('Setting up storage policies...');
    
    // Allow public read access
    const { error: readPolicyError } = await supabase.rpc('create_or_update_policy', {
      policy_name: 'Allow public read access',
      table_name: 'objects',
      using: 'bucket_id = \'report-images\'',
      check: null,
      role: 'public',
      command: 'SELECT'
    });

    if (readPolicyError) {
      console.error('Error setting read policy:', readPolicyError);
    }

    // Allow authenticated users to upload files
    const { error: uploadPolicyError } = await supabase.rpc('create_or_update_policy', {
      policy_name: 'Allow authenticated uploads',
      table_name: 'objects',
      using: 'bucket_id = \'report-images\'',
      check: 'auth.role() = \'authenticated\'',
      role: 'authenticated',
      command: 'INSERT'
    });

    if (uploadPolicyError) {
      console.error('Error setting upload policy:', uploadPolicyError);
    }

    console.log('Storage initialization complete!');
  } catch (error) {
    console.error('Error initializing storage:', error);
    process.exit(1);
  }
}

initStorage();
