import { Hono } from 'hono';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getSupabaseClient } from '../db/supabase';
import { adminAuth, requireTenantId } from '../middleware/auth';

const storageRouter = new Hono();

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
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

// In-memory rate limiting for uploads (max 30 requests per minute per IP)
const uploadRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkUploadRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = uploadRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    uploadRateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 30) {
    return false;
  }
  entry.count++;
  return true;
}

// 1. Direct Server Multipart File Upload
storageRouter.post('/upload', async (c) => {
  const clientIp = c.req.header('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (!checkUploadRateLimit(clientIp)) {
    return c.json({ success: false, error: 'Terlalu banyak permintaan unggah berkas. Silakan coba beberapa saat lagi.' }, 429);
  }

  try {
    let file: File | null = null;
    let prefix = 'upload';

    try {
      const formData = await c.req.formData();
      file = (formData.get('file') as File) || (formData.get('document') as File) || (formData.get('image') as File);
      const formPrefix = formData.get('prefix');
      if (typeof formPrefix === 'string') prefix = formPrefix;
    } catch (_e) {
      try {
        const body = await c.req.parseBody();
        file = (body['file'] as File) || (body['document'] as File) || (body['image'] as File);
        if (typeof body['prefix'] === 'string') prefix = body['prefix'];
      } catch (_e2) {}
    }

    if (!file || !(file instanceof File)) {
      return c.json({ success: false, error: 'File tidak ditemukan dalam request multipart.' }, 400);
    }

    const contentType = (file.type || 'image/png').toLowerCase();
    if (contentType && !ALLOWED_MIME_TYPES.has(contentType)) {
      return c.json({ error: `Tipe file '${contentType}' tidak diizinkan untuk alasan keamanan.` }, 400);
    }

    const isAdminAsset = prefix.startsWith('school_logo') || prefix.startsWith('hero_bg') || prefix.startsWith('major_') || prefix.startsWith('pimpinan_photo');
    const authHeader = c.req.header('Authorization');

    let tenantFolder = 'general';

    // Verify token for admin assets
    if (isAdminAsset && authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = await import('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        if (secret) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const decoded = jwt.default.verify(token, secret) as any;
          if (decoded.school_id || decoded.school_slug) {
            tenantFolder = String(decoded.school_id || decoded.school_slug).replace(/[^a-zA-Z0-9_-]/g, '_');
          }
        }
      } catch (_jwtErr) {}
    }

    // Block SVG files from unauthenticated or public uploads
    if (contentType === 'image/svg+xml') {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Format SVG hanya diizinkan untuk administrator terotentikasi.' }, 403);
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const dataBuffer = Buffer.from(arrayBuffer);
    const fileSize = dataBuffer.length;

    // Enforce size limits
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
    const MAX_DOC_SIZE = 10 * 1024 * 1024;  // 10 MB
    const MAX_MEDIA_SIZE = 25 * 1024 * 1024; // 25 MB

    if (contentType.startsWith('image/') && contentType !== 'image/svg+xml' && fileSize > MAX_IMAGE_SIZE) {
      return c.json({ error: 'Ukuran foto melebihi batas maksimal (5 MB).' }, 413);
    } else if (contentType === 'application/pdf' && fileSize > MAX_DOC_SIZE) {
      return c.json({ error: 'Ukuran dokumen melebihi batas maksimal (10 MB).' }, 413);
    } else if (fileSize > MAX_MEDIA_SIZE) {
      return c.json({ error: 'Ukuran berkas melebihi batas maksimal (25 MB).' }, 413);
    }

    // Sanitize SVG against Stored XSS
    if (contentType === 'image/svg+xml') {
      const svgText = dataBuffer.toString('utf8').toLowerCase();
      if (
        svgText.includes('<script') ||
        svgText.includes('javascript:') ||
        svgText.includes('onload=') ||
        svgText.includes('onerror=') ||
        svgText.includes('onclick=') ||
        svgText.includes('<iframe')
      ) {
        return c.json({ error: 'File SVG ditolak karena terdeteksi mengandung elemen skrip yang tidak aman.' }, 400);
      }
    }

    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const filename = `${tenantFolder}/${cleanPrefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;

    // Tier 1: Try Supabase Cloud Storage
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (serviceRoleKey) {
      try {
        const supabase = getSupabaseClient(serviceRoleKey);
        const bucketName = 'cationgate-media';
        const { error: sbErr } = await supabase.storage.from(bucketName).upload(filename, dataBuffer, {
          contentType,
          upsert: true
        });

        if (!sbErr) {
          const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filename);
          if (publicUrlData?.publicUrl) {
            return c.json({
              success: true,
              publicUrl: publicUrlData.publicUrl,
              fileName: filename
            });
          }
        }
      } catch (cloudErr) {
        console.warn('Supabase cloud storage direct upload notice:', cloudErr);
      }
    }

    // Tier 2: Try Local Filesystem
    try {
      const targetDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetPath = path.join(targetDir, filename);
      fs.writeFileSync(targetPath, dataBuffer);

      return c.json({
        success: true,
        publicUrl: `/assets/uploads/${filename}`,
        fileName: filename
      });
    } catch (_fsErr) {
      // Tier 3: Return Base64 data URL for read-only serverless environments
      const base64Url = `data:${contentType};base64,${dataBuffer.toString('base64')}`;
      return c.json({
        success: true,
        publicUrl: base64Url,
        fileName: filename
      });
    }
  } catch (error: unknown) {
    console.error('Error uploading file directly to server:', error);
    return c.json({ error: error instanceof Error ? error.message : 'Gagal mengunggah file ke server.' }, 500);
  }
});

// 2. Pre-Signed URL for direct client-to-cloud upload (Admin only)
storageRouter.post('/presigned-url', adminAuth, async (c) => {
  try {
    const schoolId = await requireTenantId(c);
    const cleanTenant = String(schoolId).replace(/[^a-zA-Z0-9_-]/g, '_');

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
    const safePath = `tenants/${cleanTenant}/uploads/${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${baseName}.${ext}`;

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
