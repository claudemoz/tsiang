import Image from "next/image";
import { ArchitectureDiagram } from "./architecture-diagram";
import type { Project, ProjectImage } from "@/data/projects";
import { isPortrait, projectHost } from "@/data/projects";

/** Web screenshot shown inside a plain browser window, with the real address when there is one. */
export function BrowserFrame({
  image,
  host,
  sizes,
  crop = false,
  className = "",
}: {
  image: ProjectImage;
  host?: string;
  sizes: string;
  /** Crop to a fixed 2:1 window (thumbnails). Otherwise the screenshot keeps its own proportions. */
  crop?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border border-border bg-card ${className}`}>
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-border bg-background px-3" aria-hidden>
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        {host ? (
          <span className="mx-auto truncate rounded bg-card px-3 text-micro leading-[18px] text-muted-foreground">{host}</span>
        ) : null}
      </div>
      {crop ? (
        <div className="relative min-h-0 flex-1">
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover object-top" />
        </div>
      ) : (
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} className="h-auto w-full" />
      )}
    </div>
  );
}

/** Mobile screenshot inside a simple phone outline. */
export function PhoneFrame({ image, sizes, className = "" }: { image: ProjectImage; sizes: string; className?: string }) {
  return (
    <div className={`rounded-[1.4rem] bg-device p-[5px] shadow-[0_18px_40px_-18px_rgb(14_23_38/0.45)] ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full rounded-[1.1rem]"
      />
    </div>
  );
}

/** Up to three phone screens side by side on a tinted panel. */
export function PhoneRow({ images, sizes, className = "" }: { images: ProjectImage[]; sizes: string; className?: string }) {
  return (
    <div className={`flex items-start justify-center gap-4 rounded-xl bg-primary-soft px-4 py-8 sm:gap-8 sm:py-12 ${className}`}>
      {images.slice(0, 3).map((image) => (
        <PhoneFrame key={image.src} image={image} sizes={sizes} className="w-[30%] max-w-[230px]" />
      ))}
    </div>
  );
}

/** Fixed-shape thumbnail used in lists, whatever the kind of screenshot. */
export function ProjectThumb({
  project,
  sizes,
  diagramCaption,
}: {
  project: Project;
  sizes: string;
  diagramCaption?: string;
}) {
  const first = project.images[0];
  if (!first) {
    return project.architecture ? (
      <ArchitectureDiagram architecture={project.architecture} compact caption={diagramCaption} className="aspect-[16/10]" />
    ) : (
      <div className="aspect-[16/10] rounded-xl border border-border bg-primary-soft" />
    );
  }
  if (isPortrait(first)) {
    const phones = project.images.filter(isPortrait).slice(0, 3);
    return (
      <div className="flex aspect-[16/10] items-center justify-center gap-[4%] overflow-hidden rounded-xl bg-primary-soft">
        {phones.map((image) => (
          <div key={image.src} className="relative h-[84%] aspect-[9/19.5] overflow-hidden rounded-[0.9rem] border-[3px] border-device bg-device">
            <Image src={image.src} alt={image.alt} fill sizes="120px" className="object-cover object-top" />
          </div>
        ))}
      </div>
    );
  }
  return <BrowserFrame image={first} host={projectHost(project)} sizes={sizes} crop className="aspect-[16/10]" />;
}
