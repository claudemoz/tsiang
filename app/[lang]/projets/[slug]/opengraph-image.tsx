import { ImageResponse } from "next/og";
import { getProject, projects } from "@/data/projects";
import { getProfile } from "@/data/profile";
import { hasLocale } from "@/lib/i18n";

export const alt = "Fiche projet de Claude Tsiangana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOgImage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "fr";
  const profile = getProfile(lang);
  const project = getProject(slug, lang);
  const meta = project ? [project.categories.join(", "), project.client, project.period].filter(Boolean).join(", ") : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f3f6f6",
          color: "#0f1d21",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#52646a" }}>{`${profile.name}, ${profile.role.toLowerCase()}`}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            {project?.title ?? ""}
          </div>
          <div style={{ display: "flex", fontSize: 38, marginTop: 28, color: "#0f1d21", maxWidth: 980, lineHeight: 1.3 }}>
            {project?.summary ?? ""}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#0e6377" }}>{meta}</div>
          <div style={{ display: "flex", height: 10, width: 160, background: "#0e6377", borderRadius: 5 }} />
        </div>
      </div>
    ),
    size,
  );
}
