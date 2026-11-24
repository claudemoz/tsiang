import { ImageResponse } from "next/og";
import { getLab, getLabNote, labNotes } from "@/data/lab";
import { getLabDemo, labDemos } from "@/data/lab-demos";
import { getDictionary } from "@/lib/dictionaries";
import { getProfile } from "@/data/profile";
import { hasLocale } from "@/lib/i18n";

export const alt = "Note technique de Claude Tsiangana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [
    ...labNotes.map((n) => ({ lab: n.lab, slug: n.slug })),
    ...labDemos.map((d) => ({ lab: d.lab, slug: d.id })),
  ];
}

/** Share card for a note or a demo of a lab: title, summary, then the lab and a console-style "Lab" tag. */
export default async function LabItemOgImage({ params }: { params: Promise<{ lab: string; slug: string; lang: string }> }) {
  const { lab: labSlug, slug, lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "fr";
  const profile = getProfile(lang);
  const lab = getLab(labSlug, lang);
  const note = getLabNote(slug, lang);
  const demo = note ? undefined : getLabDemo(slug);
  const demoText = demo ? getDictionary(lang).labDemos[demo.kind] : undefined;
  const title = note?.title ?? demoText?.title ?? "";
  const summary = note?.summary ?? demoText?.plain ?? "";

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#52646a" }}>{`${profile.name}, ${profile.role.toLowerCase()}`}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 20px",
              borderRadius: 10,
              background: "#0f1d21",
              color: "#f3f6f6",
              fontSize: 30,
            }}
          >
            <div style={{ display: "flex" }}>Lab</div>
            <div style={{ display: "flex", width: 12, height: 30, background: "#f0b54a", borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1040 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 34, marginTop: 28, maxWidth: 1000, lineHeight: 1.3 }}>
            {summary}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#0e6377" }}>{lab?.title ?? ""}</div>
          <div style={{ display: "flex", height: 10, width: 160, background: "#0e6377", borderRadius: 5 }} />
        </div>
      </div>
    ),
    size,
  );
}
