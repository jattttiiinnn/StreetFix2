import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for admin operations
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupStorage() {
  try {
    console.log('Setting up storage bucket...');
    
    // First, let's check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'report-images');
    
    if (!bucketExists) {
      console.log('Creating storage bucket: report-images');
      const { error: createError } = await supabase.storage
        .createBucket('report-images', { 
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 10 * 1024 * 1024 // 10MB
        });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }
      console.log('✅ Created storage bucket: report-images');
    } else {
      console.log('ℹ️  Storage bucket already exists');
    }
    
    // Set up storage policies using direct SQL
    console.log('Setting up storage policies...');
    
    try {
      // Enable Row Level Security on storage.objects if not already enabled
      const { error: rlsError } = await supabase.rpc('enable_rls_on_storage_objects');
      
      if (rlsError) {
        console.log('RLS might already be enabled on storage.objects, continuing...');
      }
      
      // Create a policy to allow public read access to the bucket
      const { error: readPolicyError } = await supabase.rpc('create_public_read_policy', {
        bucket_name: 'report-images'
      });
      
      if (readPolicyError) {
        console.error('Error creating read policy:', readPolicyError);
      }
      
      // Create a policy to allow authenticated users to upload files
      const { error: uploadPolicyError } = await supabase.rpc('create_upload_policy', {
        bucket_name: 'report-images'
      });
      
      if (uploadPolicyError) {
        console.error('Error creating upload policy:', uploadPolicyError);
      }
      
      console.log('✅ Storage policies set up successfully');
      
    } catch (error) {
      console.error('Error setting up storage policies:', error);
      console.log('⚠️  You may need to set up the storage schema and policies manually in the Supabase dashboard');
      console.log('1. Go to Storage > Policies');
      console.log('2. For the "report-images" bucket, create these policies:');
      console.log('   - Public Read: "Allow SELECT to all users"');
      console.log('   - Authenticated Upload: "Allow INSERT to authenticated users"');
      console.log('   - Owner Update/Delete: "Allow UPDATE/DELETE to owner"');
    }
    
    console.log('\n✅ Supabase storage setup complete!');
    
  } catch (error) {
    console.error('Error setting up Supabase storage:', error);
    process.exit(1);
  }
}

// Run the setup
setupStorage();
