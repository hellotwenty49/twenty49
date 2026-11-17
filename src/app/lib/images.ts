/**
 * Shrinks photos in the browser before they are saved or uploaded.
 *
 * Plan: scale the long edge down to a size that still looks sharp on a phone,
 * then lower the encoding quality step by step until the file is small enough.
 * If it is still too big at the lowest quality we allow, shrink the picture a
 * little more and try again. WebP is used where the browser can make it (it is
 * smaller at the same quality), otherwise JPEG.
 */

/** Long edge in pixels. Plenty for a full-width phone photo. */
const MAX_EDGE = 1600;
/** Never go smaller than this on the long edge. */
const MIN_EDGE = 1000;
/** Target size per photo. */
const TARGET_BYTES = 300 * 1024;
const QUALITY_START = 0.88;
const QUALITY_FLOOR = 0.66;
const QUALITY_STEP = 0.04;

const encode = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

export interface CompressedImage {
  blob: Blob;
  width: number;
  height: number;
}

export async function compressImage(file: File): Promise<CompressedImage> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    let edge = Math.min(MAX_EDGE, Math.max(bitmap.width, bitmap.height));
    for (;;) {
      const scale = edge / Math.max(bitmap.width, bitmap.height);
      const width = Math.max(1, Math.round(bitmap.width * Math.min(1, scale)));
      const height = Math.max(1, Math.round(bitmap.height * Math.min(1, scale)));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.fillStyle = "#fff"; // JPEG has no transparency
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);

      // Prefer WebP; browsers that can't make it quietly hand back a PNG, so check.
      let type = "image/webp";
      let best: Blob | null = null;
      for (let q = QUALITY_START; q >= QUALITY_FLOOR - 0.001; q -= QUALITY_STEP) {
        let blob = await encode(canvas, type, q);
        if (blob && blob.type !== type) {
          type = "image/jpeg";
          blob = await encode(canvas, type, q);
        }
        if (!blob) continue;
        best = blob;
        if (blob.size <= TARGET_BYTES) return { blob, width, height };
      }
      // Still too big at the lowest quality: make the picture a little smaller and retry.
      if (edge <= MIN_EDGE || !best) {
        if (!best) throw new Error("Could not encode image");
        return { blob: best, width, height };
      }
      edge = Math.max(MIN_EDGE, Math.round(edge * 0.85));
    }
  } finally {
    bitmap.close();
  }
}

export const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
