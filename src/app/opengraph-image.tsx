import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Rennie Lab — A Creative Advisory Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0e0e10",
          color: "#fbfbf7",
          padding: "72px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fbfbf7",
            opacity: 0.6,
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Rennie Lab</div>
          <div style={{ display: "flex" }}>SYD · LA</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            lineHeight: 1.04,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            color: "#fbfbf7",
            width: 1040,
          }}
        >
          <div style={{ display: "flex" }}>Clean creative for the</div>
          <div style={{ display: "flex" }}>
            things that&nbsp;
            <span style={{ color: "#E94E4D" }}>actually matter</span>.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#fbfbf7",
            opacity: 0.55,
            fontSize: 18,
          }}
        >
          <div style={{ display: "flex" }}>A creative advisory studio · est. 2017</div>
          <div style={{ display: "flex", letterSpacing: "0.08em" }}>rennielab.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
