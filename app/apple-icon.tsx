import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#081B33",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="11" stroke="#D6A94E" strokeWidth="1.6" />
          <path
            d="M13 4 L13 9 M13 17 L13 22 M4 13 L9 13 M17 13 L22 13"
            stroke="#74A7C7"
            strokeWidth="1.4"
          />
          <circle cx="13" cy="13" r="2.6" fill="#D6A94E" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
