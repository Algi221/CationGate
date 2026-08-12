import { z } from 'zod';

/**
 * Validates a base64 encoded file data URI.
 * Checks MIME type, format, and size limits.
 * 
 * @param maxSizeMb Maximum file size in MB
 * @param allowedMimes Array of allowed MIME types (e.g. ['image/jpeg', 'image/png'])
 */
export const base64FileSchema = (maxSizeMb: number, allowedMimes: string[]) => {
  return z.string().optional().default('').refine((val) => {
    // If empty or not provided, let optional/default pass
    if (!val) return true;
    
    // Accept standard URLs (from Supabase direct uploads)
    if (val.startsWith('http')) return true;
    
    // Check if it has a valid Data URI prefix
    if (!val.startsWith('data:')) return false;
    
    const matches = val.match(/^data:([A-Za-z0-9-+\/.]+);base64,/);
    if (!matches) return false;
    
    // Verify MIME Type
    const mimeType = matches[1];
    if (!allowedMimes.includes(mimeType)) return false;
    
    // Extract base64 payload to calculate size
    const parts = val.split(',')[1];
    if (!parts) return false;
    
    // Size estimation in bytes
    const sizeInBytes = Math.ceil((parts.length * 3) / 4);
    return sizeInBytes <= maxSizeMb * 1024 * 1024;
  }, {
    message: `File tidak valid. Pastikan format berupa ${allowedMimes.join('/')} dengan ukuran maksimal ${maxSizeMb}MB.`
  });
};
