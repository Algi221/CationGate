import { Hono } from 'hono';
import fs from 'fs';
import path from 'path';
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

// 1. Direct Server Multipart File Upload
storageRouter.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'];
    const prefix = typeof body['prefix'] === 'string' ? body['prefix'] : 'upload';

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'File tidak ditemukan dalam request multipart.' }, 400);
    }

    const contentType = file.type;
    if (contentType && !ALLOWED_MIME_TYPES.has(contentType.toLowerCase())) {
      return c.json({ error: `Tipe file '${contentType}' tidak diizinkan untuk alasan keamanan.` }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    const targetDir = path.join(process.cwd(), 'public', 'assets', 'uploads');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const filename = `${cleanPrefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const targetPath = path.join(targetDir, filename);

    fs.writeFileSync(targetPath, dataBuffer);

    const publicUrl = `/assets/uploads/${filename}`;
    return c.json({
      success: true,
      publicUrl,
      fileName: filename
    });
  } catch (error: unknown) {
    console.error('Error uploading file directly to server:', error);
    return c.json({ error: error instanceof Error ? error.message : 'Gagal mengunggah file ke server.' }, 500);
  }
});

// 2. Pre-Signed URL for direct client-to-cloud upload (optional cloud fallback)
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

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (!serviceRoleKey) {
      return c.json({ error: 'Konfigurasi Supabase storage belum disetel.', fallbackToDirectUpload: true }, 503);
    }

    let supabase;
    try {
      supabase = getSupabaseClient(serviceRoleKey);
    } catch (_e) {
      return c.json({ error: 'Inisialisasi Supabase client gagal.', fallbackToDirectUpload: true }, 503);
    }

    const ext = (fileName.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const safePath = `uploads/${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${baseName}.${ext}`;

    // Create a signed upload URL valid for 300 seconds (5 minutes)
    const { data, error } = await supabase.storage.from(bucketName).createSignedUploadUrl(safePath, {
      upsert: false,
    });

    if (error) {
      console.warn('Supabase storage createSignedUploadUrl:', error.message);
      return c.json({ error: error.message, fallbackToDirectUpload: true }, 503);
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
    return c.json({ error: error instanceof Error ? error.message : 'Gagal menghasilkan URL upload aman.', fallbackToDirectUpload: true }, 500);
  }
});

export default storageRouter;
