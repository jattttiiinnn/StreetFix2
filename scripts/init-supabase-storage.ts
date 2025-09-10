import { supabase } from '../lib/supabase/client';

/**
 * This script initializes the Supabase storage bucket for report images
 * Run with: npx ts-node scripts/init-supabase-storage.ts
 */
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
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });

      if (createError) {
        throw createError;
      }
      console.log('Created report-images bucket');
    } else {
      console.log('report-images bucket already exists');
    }

    // Create reports folder inside the bucket
    console.log('Creating reports folder...');
    const { error: folderError } = await supabase.storage
      .from('report-images')
      .upload('reports/.gitkeep', new Blob([''], { type: 'text/plain' }));

    if (folderError && !folderError.message.includes('already exists')) {
      console.error('Error creating reports folder:', folderError);
    } else {
      console.log('Reports folder created or already exists');
    }

    console.log('Storage initialization complete!');
  } catch (error) {
    console.error('Error initializing storage:', error);
    process.exit(1);
  }
}

initStorage();