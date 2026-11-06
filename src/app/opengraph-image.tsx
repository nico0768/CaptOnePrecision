import { ImageResponse } from "next/og";
import { contenuParDefaut } from "@/content/defaut";

// Image d'aperçu affichée lors du partage d'un lien (LinkedIn, WhatsApp…).
const { nom, titre } = contenuParDefaut.identite;

export const alt = `${nom} — ${titre}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#020d26",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 56, height: 6, background: "#ff7a3d" }} />
          <div style={{ width: 16, height: 6, background: "#ff7a3d" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, lineHeight: 1, fontWeight: 300 }}>Capt One</div>
          <div style={{ fontSize: 120, lineHeight: 1, fontWeight: 700 }}>PRECISION</div>
        </div>
        <div style={{ fontSize: 30, color: "#b2bacb" }}>{titre}</div>
      </div>
    ),
    size,
  );
}
