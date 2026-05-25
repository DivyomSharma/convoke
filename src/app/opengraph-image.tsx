import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Convoke";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #030304, #15110e 52%, #0a1118)",
          color: "#f6f1ea",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: 80,
          width: "100%",
        }}
      >
        <div style={{ fontSize: 32, letterSpacing: 12, marginBottom: 36 }}>
          CONVOKE
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 0.95, textAlign: "center" }}>
          Communities, opportunities, events, and momentum.
        </div>
      </div>
    ),
    size,
  );
}
