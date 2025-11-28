// hooks/useAvatarDownload.tsx
import { useCallback } from "react";
import { useWimmelbildState } from "./useWimmelbildState";
import { useQuizState } from "./useQuizState";
import { STRENGTH_SHARE, VALUE_SHARE } from "@/assets/share.json";

const isDevelopment = import.meta.env.DEV;
const fontPath = isDevelopment
  ? "/node_modules/@fontsource/poppins/files"
  : "/assets/fonts";

export function useAvatarDownload() {
  const { result } = useQuizState();
  const { image: wimmelbild } = useWimmelbildState();

  const valueKey = result?.valueKey;
  const strengthKey = result?.strengthKey;

  const valueShare = valueKey
    ? VALUE_SHARE[valueKey as keyof typeof VALUE_SHARE]
    : null;
  const strengthShare = strengthKey
    ? STRENGTH_SHARE[strengthKey as keyof typeof STRENGTH_SHARE]
    : null;

  const handleDownload = useCallback(
    async (avatarCanvas: HTMLCanvasElement) => {
      if (!avatarCanvas) return;

      // Lazy load satori only when needed
      const { default: satori } = await import("satori");

      // Convert avatar canvas to data URL
      const avatarDataUrl = avatarCanvas.toDataURL("image/png");

      // Generate SVG using Satori
      const svg = await satori(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            backgroundImage:
              wimmelbild && "source" in wimmelbild
                ? `url(${wimmelbild.source})`
                : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "60px",
          }}
        >
          {/* White overlay card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "24px",
              padding: "60px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontSize: "56px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  margin: 0,
                }}
              >
                Futur-O-Mat
              </h1>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "28px",
                  color: "#6b7280",
                  margin: "10px 0 0 0",
                }}
              >
                Dein persönliches Ergebnis
              </p>
            </div>

            {/* Avatar centered */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "30px",
              }}
            >
              <img
                src={avatarDataUrl}
                width={380}
                height={456}
                style={{
                  borderRadius: "200px",
                }}
              />
            </div>

            {/* Text content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
                flex: 1,
                justifyContent: "center",
              }}
            >
              {/* Value */}
              {valueShare?.description && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h2
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0 0 12px 0",
                      textAlign: "center",
                    }}
                  >
                    Dein Wert
                  </h2>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "24px",
                      color: "#374151",
                      margin: 0,
                      lineHeight: 1.25,
                      textAlign: "center",
                    }}
                  >
                    {valueShare.description}
                  </p>
                </div>
              )}

              {/* Strength */}
              {strengthShare?.description && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h2
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#1f2937",
                      margin: "0 0 12px 0",
                      textAlign: "center",
                    }}
                  >
                    Deine Stärke
                  </h2>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "24px",
                      color: "#374151",
                      margin: 0,
                      lineHeight: 1.25,
                      textAlign: "center",
                    }}
                  >
                    {strengthShare.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>,
        {
          width: 1200,
          height: 1200,
          fonts: [
            {
              name: "Poppins",
              data: await fetch(
                `${fontPath}/poppins-latin-400-normal.woff`
              ).then((res) => res.arrayBuffer()),
              weight: 400,
              style: "normal",
            },
            {
              name: "Poppins",
              data: await fetch(
                `${fontPath}/poppins-latin-700-normal.woff`
              ).then((res) => res.arrayBuffer()),
              weight: 700,
              style: "normal",
            },
          ],
        }
      );

      // Convert SVG to PNG
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 1200;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        // Download
        const link = document.createElement("a");
        link.download = `mein-futur-o-mat-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svg);
    },
    [wimmelbild, valueShare, strengthShare]
  );

  return {
    handleDownload,
  };
}
