import { Hono } from 'hono';
import { getSupabaseClient } from '../db/supabase';

const storageRouter = new Hono();

storageRouter.post('/presigned-url', async (c) => {
  try {
    const body = await c.req.json();
    const { fileName, contentType, bucketName = 'cationgate-media' } = body;
    
    if (!fileName || !contentType) {
      return c.json({ error: 'Missing fileName or contentType' }, 400);
    }
    
    // Use the Service Role Key to generate the pre-signed URL securely on the backend
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
       console.error("SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.");
       return c.json({ error: 'Server configuration error' }, 500);
    }

    const supabase = getSupabaseClient(serviceRoleKey);
    
    // Create a path that ensures uniqueness to prevent overrides
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `uploads/${Date.now()}_${Math.floor(Math.random() * 1000)}_${safeFileName}`;
    
    // Create a signed upload URL valid for 300 seconds
    const { data, error } = await supabase.storage.from(bucketName).createSignedUploadUrl(path, {
      upsert: false,
    });
    
    if (error) {
      throw error;
    }
    
    // Return the final public URL as well so the client can save it
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(path);
    
    return c.json({
      signedUrl: data.signedUrl,
      publicUrl: publicUrlData.publicUrl,
      path: path,
    });
  } catch (error: any) {
    console.error('Error generating pre-signed URL:', error);
    return c.json({ error: error.message || 'Failed to generate pre-signed URL' }, 500);
  }
});

export default storageRouter;
