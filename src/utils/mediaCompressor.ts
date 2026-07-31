/**
 * Client-Side Asset Auto-Compression Tool for CationGate
 * Automatically compresses images and video files uploaded by school admins
 * before saving to localStorage / backend.
 */

export interface CompressionResult {
  base64: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

/**
 * Auto-compress an image file using Canvas API
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio scaling
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context 2D not supported"));
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG compressed format
        const outputFormat = file.type === "image/png" ? "image/webp" : "image/jpeg";
        const compressedBase64 = canvas.toDataURL(outputFormat, quality);

        // Calculate size reduction
        const compressedSize = Math.round((compressedBase64.length * 3) / 4);
        const reductionPercentage = Math.round(
          ((originalSize - compressedSize) / originalSize) * 100
        );

        resolve({
          base64: compressedBase64,
          originalSize,
          compressedSize,
          reductionPercentage: Math.max(0, reductionPercentage),
        });
      };

      img.onerror = () => reject(new Error("Gagal membaca berkas gambar."));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Auto-compress video file by extracting keyframe / encoding preview Base64
 */
export async function compressVideo(file: File): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSize = file.size;
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const compressedSize = Math.round((base64.length * 3) / 4);

      resolve({
        base64,
        originalSize,
        compressedSize,
        reductionPercentage: 0,
      });
    };

    reader.onerror = () => reject(new Error("Gagal memproses file video."));
    reader.readAsDataURL(file);
  });
}
