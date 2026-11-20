import type { ImageLoaderProps } from "next/image";

const CLOUDINARY_UPLOAD_URL = "https://res.cloudinary.com/daogrxxyw/image/upload";

/**
 * next/image loader (`images.loaderFile` in next.config.ts): Cloudinary resizes and picks the format
 * (AVIF or WebP, `f_auto`) on its CDN, so the Next server no longer optimizes images.
 * Local paths (images not uploaded yet) are served as is.
 *
 * No "use client": Next also calls this loader on the server, where a client module is only a
 * reference and not a function ("customImageLoader is not a function").
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith(`${CLOUDINARY_UPLOAD_URL}/`)) {
    const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality ?? "auto"}`].join(",");
    return src.replace(`${CLOUDINARY_UPLOAD_URL}/`, `${CLOUDINARY_UPLOAD_URL}/${params}/`);
  }
  return `${src}?w=${width}`;
}
