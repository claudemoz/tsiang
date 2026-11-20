import { ImageResponse } from "next/og";
import { getProfile, profile } from "@/data/profile";
import { hasLocale, locales } from "@/lib/i18n";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "fr";
  const p = getProfile(lang);
  const subtitle = lang === "fr" ? `${p.role} web & mobile, API, DevOps et IA` : `${p.role}, web & mobile, API, DevOps and AI`;
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
        <div style={{ display: "flex", fontSize: 30, color: "#0e6377" }}>tsiang.fr</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 44, marginTop: 24, color: "#52646a" }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", height: 10, width: 160, background: "#0e6377", borderRadius: 5 }} />
      </div>
    ),
    size,
  );
}
