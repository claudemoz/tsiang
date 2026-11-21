import { placeholders } from "./placeholders";

/** `blurDataURL`: tiny blurred preview shown while the image loads (scripts/image-placeholders.mjs). */
export type MediaImage = { src: string; width: number; height: number; blurDataURL?: string };

export function imageSrc(src: string, width: number, height: number): MediaImage;
export function imageSrc(src: string, width: number, height: number, alt: string): MediaImage & { alt: string };
export function imageSrc(src: string, width: number, height: number, alt?: string) {
  const blurDataURL = placeholders[src];
  return { src, width, height, ...(blurDataURL ? { blurDataURL } : {}), ...(alt === undefined ? {} : { alt }) };
}

/** next/image props that paint the blurred preview until the real image has loaded. */
export function placeholderProps(image: MediaImage) {
  return image.blurDataURL ? { placeholder: "blur" as const, blurDataURL: image.blurDataURL } : {};
}
