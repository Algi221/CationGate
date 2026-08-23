import { Hono } from 'hono';
import crypto from 'crypto';
import { getSupabaseClient } from '../db/supabase';

const storageRouter = new Hono();

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'audio/mpeg',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel'
]);

const ALLOWED_BUCKETS = new Set([
  'cationgate-media',
  'ppdb-assets',
  'documents',
  'school-assets'
]);

storageRouter.post('/presigned-url', async (c) => {
  try {
    const body = await c.req.json();
    const { fileName, contentType, bucketName = 'cationgate-media' } = body;

    if (!fileName || !contentType) {
      return c.json({ error: 'Parameter fileName dan contentType wajib disertakan.' }, 400);
    }

    if (!ALLOWED_MIME_TYPES.has(contentType.toLowerCase())) {
      return c.json({ error: `Tipe file '${contentType}' tidak diizinkan untuk alasan keamanan.` }, 400);
    }

    if (!ALLOWED_BUCKETS.has(bucketName)) {
      return c.json({ error: `Bucket penyimpanan '${bucketName}' tidak valid.` }, 400);
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error("SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.");
      return c.json({ error: 'Konfigurasi server storage belum lengkap.' }, 500);
    }

    const supabase = getSupabaseClient(serviceRoleKey);

    const ext = (fileName.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const safePath = `uploads/${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${baseName}.${ext}`;

    // Create a signed upload URL valid for 300 seconds (5 minutes)
    const { data, error } = await supabase.storage.from(bucketName).createSignedUploadUrl(safePath, {
      upsert: false,
    });

    if (error) {
      throw error;
    }

    // Return the final public URL
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(safePath);

    return c.json({
      signedUrl: data.signedUrl,
      publicUrl: publicUrlData.publicUrl,
      path: safePath,
    });
  } catch (error: unknown) {
    console.error('Error generating pre-signed URL:', error);
    return c.json({ error: error instanceof Error ? error.message : 'Gagal menghasilkan URL upload aman.' }, 500);
  }
});

export default storageRouter;
