// hooks/useAvatarDownload.ts
import { useCallback } from "react";
import { useWimmelbildState } from "./useWimmelbildState";
import { useQuizState } from "./useQuizState";
import { STRENGTH_SHARE, VALUE_SHARE } from "@/assets/share.json";

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

  // Hilfsfunktion für Textumbruch
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  // Erweiterte Download-Funktion für Handy-Format
  const handleDownload = useCallback(
    (avatarCanvas: HTMLCanvasElement) => {
      if (!avatarCanvas) return;

      // Handy-Format
      const downloadCanvas = document.createElement("canvas");
      const ctx = downloadCanvas.getContext("2d");
      if (!ctx) return;

      // Handy-Größe (9:16 Aspect Ratio)
      downloadCanvas.width = 1080;
      downloadCanvas.height = 1920;

      // Weißer Hintergrund
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

      // Wimmelbild als Haupt-Hintergrund (nicht transparent)
      if (wimmelbild && "source" in wimmelbild) {
        const wimmelImg = new Image();
        wimmelImg.crossOrigin = "anonymous";
        wimmelImg.onload = () => {
          // Wimmelbild als vollständiger Hintergrund
          ctx.drawImage(
            wimmelImg,
            0,
            0,
            downloadCanvas.width,
            downloadCanvas.height
          );

          // Weißer Overlay für bessere Lesbarkeit des Textes
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.fillRect(
            40,
            80,
            downloadCanvas.width - 80,
            downloadCanvas.height - 160
          );

          // Header
          ctx.fillStyle = "#1f2937";
          ctx.font = "bold 48px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Futur-O-Mat", downloadCanvas.width / 2, 160);

          ctx.font = "24px Arial";
          ctx.fillStyle = "#6b7280";
          ctx.fillText(
            "Dein persönliches Ergebnis",
            downloadCanvas.width / 2,
            210
          );

          // GROSSER Avatar auf der LINKEN Seite
          const avatarSize = 500; // Viel größer
          const avatarX = 60; // Weiter links
          const avatarY = 280;

          ctx.drawImage(avatarCanvas, avatarX, avatarY, avatarSize, avatarSize);

          // Textbereich auf der RECHTEN Seite neben dem Avatar
          const textX = avatarX + avatarSize + 40; // Rechts neben dem Avatar
          let textY = avatarY + 40;
          const textWidth = downloadCanvas.width - textX - 40; // Verfügbare Breite

          ctx.textAlign = "left";

          // Value Text - GRÖSSERE SCHRIFT
          if (valueShare?.description) {
            ctx.font = "bold 36px Arial";
            ctx.fillStyle = "#1f2937";
            ctx.fillText("Dein Wert", textX, textY);
            textY += 50;

            ctx.font = "26px Arial"; // Größere Schrift
            ctx.fillStyle = "#374151";
            textY = wrapText(
              ctx,
              valueShare.description,
              textX,
              textY,
              textWidth,
              32
            );
            textY += 40;
          }

          // Strength Text - GRÖSSERE SCHRIFT
          if (strengthShare?.description) {
            ctx.font = "bold 36px Arial";
            ctx.fillStyle = "#1f2937";
            ctx.fillText("Deine Stärke", textX, textY);
            textY += 50;

            ctx.font = "26px Arial"; // Größere Schrift
            ctx.fillStyle = "#374151";
            wrapText(
              ctx,
              strengthShare.description,
              textX,
              textY,
              textWidth,
              32
            );
          }

          // Footer
          ctx.fillStyle = "#6b7280";
          ctx.font = "18px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            "Erstellt mit Futur-O-Mat",
            downloadCanvas.width / 2,
            downloadCanvas.height - 60
          );

          // Download auslösen
          const link = document.createElement("a");
          link.download = `mein-futur-o-mat-${Date.now()}.png`;
          link.href = downloadCanvas.toDataURL("image/png");
          link.click();
        };
        wimmelImg.src = wimmelbild.source;
      } else {
        // Fallback ohne Wimmelbild
        // Header
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Futur-O-Mat", downloadCanvas.width / 2, 160);

        ctx.font = "24px Arial";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(
          "Dein persönliches Ergebnis",
          downloadCanvas.width / 2,
          210
        );

        // GROSSER Avatar auf der LINKEN Seite
        const avatarSize = 500;
        const avatarX = 60;
        const avatarY = 280;

        ctx.drawImage(avatarCanvas, avatarX, avatarY, avatarSize, avatarSize);

        // Textbereich auf der RECHTEN Seite neben dem Avatar
        const textX = avatarX + avatarSize + 40;
        let textY = avatarY + 40;
        const textWidth = downloadCanvas.width - textX - 40;

        ctx.textAlign = "left";

        // Value Text - GRÖSSERE SCHRIFT
        if (valueShare?.description) {
          ctx.font = "bold 36px Arial";
          ctx.fillStyle = "#1f2937";
          textY += 50;

          ctx.font = "26px Arial";
          ctx.fillStyle = "#374151";
          textY = wrapText(
            ctx,
            valueShare.description,
            textX,
            textY,
            textWidth,
            32
          );
          textY += 40;
        }

        // Strength Text - GRÖSSERE SCHRIFT
        if (strengthShare?.description) {
          ctx.font = "bold 36px Arial";
          ctx.fillStyle = "#1f2937";
          textY += 50;

          ctx.font = "26px Arial";
          ctx.fillStyle = "#374151";
          wrapText(ctx, strengthShare.description, textX, textY, textWidth, 32);
        }

        // Download auslösen
        const link = document.createElement("a");
        link.download = `mein-futur-o-mat-${Date.now()}.png`;
        link.href = downloadCanvas.toDataURL("image/png");
        link.click();
      }
    },
    [wimmelbild, valueShare, strengthShare]
  );

  return {
    handleDownload,
  };
}
