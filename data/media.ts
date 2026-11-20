
export type MediaImage = { src: string; width: number; height: number };

export function imageSrc(src: string, width: number, height: number): MediaImage;
export function imageSrc(src: string, width: number, height: number, alt: string): MediaImage & { alt: string };
export function imageSrc(src: string, width: number, height: number, alt?: string) {
  return alt === undefined ? { src, width, height } : { src, width, height, alt };
}
