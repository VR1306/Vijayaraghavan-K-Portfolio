import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#081B33",
          backgroundImage:
            "linear-gradient(rgba(214,169,78,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(214,169,78,0.14) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#F2EFE6",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="40" height="40" viewBox="0 0 26 26" fill="none">
              <circle cx="13" cy="13" r="11" stroke="#D6A94E" strokeWidth="1.6" />
              <path
                d="M13 4 L13 9 M13 17 L13 22 M4 13 L9 13 M17 13 L22 13"
                stroke="#74A7C7"
                strokeWidth="1.4"
              />
              <circle cx="13" cy="13" r="2.6" fill="#D6A94E" />
            </svg>
            <span style={{ fontSize: 22, letterSpacing: 2, color: "#A6BBC7" }}>
              VIJAYARAGHAVAN K
            </span>
          </div>
          <span
            style={{
              fontSize: 16,
              letterSpacing: 2,
              color: "#081B33",
              backgroundColor: "#D6A94E",
              padding: "6px 14px",
            }}
          >
            SHEET A-01
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
            {site.name}
          </span>
          <span style={{ fontSize: 32, color: "#F0C368" }}>{site.role}</span>
          <span style={{ fontSize: 24, color: "#CBD6DD", maxWidth: 900, lineHeight: 1.5 }}>
            {site.tagline}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
