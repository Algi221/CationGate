import { z } from 'zod';

export const base64FileSchema = (maxSizeMb: number, allowedMimes: string[]) => {
  return z.string().optional().default('').refine((val) => {

    if (!val) return true;

    if (val.startsWith('http')) return true;

    if (!val.startsWith('data:')) return false;

    const matches = val.match(/^data:([A-Za-z0-9-+\/.]+);base64,/);
    if (!matches) return false;

    const mimeType = matches[1];
    if (!allowedMimes.includes(mimeType)) return false;

    const parts = val.split(',')[1];
    if (!parts) return false;

    const sizeInBytes = Math.ceil((parts.length * 3) / 4);
    return sizeInBytes <= maxSizeMb * 1024 * 1024;
  }, {
    message: `File tidak valid. Pastikan format berupa ${allowedMimes.join('/')} dengan ukuran maksimal ${maxSizeMb}MB.`
  });
};
