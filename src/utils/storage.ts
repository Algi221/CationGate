
export async function uploadFileDirect(file: File, prefix: string = 'media'): Promise<string> {
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    throw new Error('Format berkas SVG tidak diizinkan demi keamanan. Harap gunakan format PNG, JPEG, atau WebP.');
  }

  const token = typeof window !== 'undefined' ? (localStorage.getItem('ppdb_admin_token') || localStorage.getItem('token')) : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 1. Try direct server multipart upload first (fast, reliable, saves directly to server storage)
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', prefix);

    const uploadRes = await fetch('/api/storage/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (uploadRes.ok) {
      const data = await uploadRes.json();
      if (data.success && data.publicUrl) {
        return data.publicUrl;
      }
    }
  } catch (_err) {
    // Continue to next fallback
  }

  // 2. Try pre-signed URL upload to cloud bucket
  try {
    const response = await fetch('/api/storage/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: `${prefix}_${file.name}`,
        contentType: file.type,
      }),
    });

    if (response.ok) {
      const { signedUrl, publicUrl } = await response.json();
      if (signedUrl && publicUrl) {
        const uploadResponse = await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        if (uploadResponse.ok) {
          return publicUrl;
        }
      }
    }
  } catch (_error) {
    // Continue to fallback
  }

  // 3. Fallback to Data URL for offline / local preview
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to convert Base64 Data URI to a File object
 */
export function base64ToFile(base64Str: string, fileName: string): File {
  const matches = base64Str.match(/^data:([A-Za-z0-9-+\/.]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }
  const contentType = matches[1];
  const byteString = atob(matches[2]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new File([arrayBuffer], fileName, { type: contentType });
}
